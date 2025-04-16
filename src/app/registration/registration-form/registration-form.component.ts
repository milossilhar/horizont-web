import { CurrencyPipe, DatePipe, JsonPipe } from '@angular/common';
import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DatePickerModule } from 'primeng/datepicker';
import { TextareaModule } from 'primeng/textarea';
import { TooltipModule } from 'primeng/tooltip';
import { CheckboxModule } from 'primeng/checkbox';
import { Destroyable } from '../../shared/base/destroyable';
import { EventHorizontService } from '../../rest/api/event.service';
import { ActivatedRoute } from '@angular/router';
import { EventCardComponent } from '../event-card/event-card.component';
import { catchError, concatMap, filter, map, merge, of, takeUntil, tap } from 'rxjs';
import { CardModule } from 'primeng/card';
import { EventTermSelectorComponent } from "../../shared/form/event-term-selector/event-term-selector.component";
import { EventPublicDTO } from '../../rest/model/event-public';
import { EventTermPublicDTO } from '../../rest/model/event-term-public';
import { ButtonModule } from 'primeng/button';
import { find, some } from 'lodash';
import { MessageModule } from 'primeng/message';
import { PRIME_CONSTANTS } from '../../shared/primeng.constant';
import { PaymentDTO } from '../../rest/model/payment';
import { RegistrationHorizontService } from '../../rest/api/api';
import { RegistrationPricingRequestDTO } from '../../rest/model/registration-pricing-request';

@Component({
  selector: 'app-registration-form',
  imports: [
    ReactiveFormsModule,
    FloatLabelModule,
    SelectButtonModule,
    DatePickerModule,
    ButtonModule,
    MessageModule,
    CheckboxModule,
    TooltipModule,
    TextareaModule,
    CardModule,
    InputTextModule,
    EventCardComponent,
    JsonPipe, DatePipe, CurrencyPipe,
    EventTermSelectorComponent
],
  templateUrl: './registration-form.component.html',
  styles: ``
})
export class RegistrationFormComponent extends Destroyable implements OnInit {
  
  protected event: WritableSignal<EventPublicDTO | undefined> = signal(undefined);
  protected isAnyPersonDependent = signal(true);
  
  protected consentPhotoOptions = PRIME_CONSTANTS.selectbutton.yesno.boolean;

  protected form;

  protected wasSubmitted = false;

  protected payment: WritableSignal<PaymentDTO> = signal({ price: 0 });
  
  constructor(
    private fb: NonNullableFormBuilder,
    private route: ActivatedRoute,
    private eventHorizontService: EventHorizontService,
    private registrationHorizontService: RegistrationHorizontService,
  ) {
    super();

    this.form = this.fb.group({
      priceCalculated: this.fb.control(false, Validators.requiredTrue),
      eventTermId: this.fb.control<number | null>(null, Validators.required),
      email: this.fb.control('', [Validators.required, Validators.email]),
      telPhone: this.fb.control('', Validators.required),
      name: this.fb.control('', Validators.required),
      surname: this.fb.control('', Validators.required),
      consentGDPR: this.fb.control('', Validators.requiredTrue),
      consentPhoto: this.fb.control<boolean|null>(null, Validators.required),
      knownPeople: this.fb.array([this.createKnownPersonForm()]),
      people: this.fb.array([this.createPersonForm()], [Validators.required, Validators.minLength(1)])
    });
    
    this.form.controls.knownPeople.clear();
  }

  ngOnInit(): void {
    const eventUUID = this.route.snapshot.params['eventUUID'];

    this.eventHorizontService.getEventByUUID(eventUUID).pipe(
      tap(event => this.event.set(event))
    ).subscribe();

    // update isAnyPersonDependent
    this.people.valueChanges.pipe(
      map(value => some(value, p => !p.isIndependent)),
      tap(isAnyPersonDependent => this.isAnyPersonDependent.set(isAnyPersonDependent)),
      takeUntil(this.destroy$)
    ).subscribe();

    // recalculate price
    let previousLength = 0;
    merge(
      this.fc.eventTermId.valueChanges,
      this.people.valueChanges.pipe(
        filter(val => {
          const currentLength = val.length;
          const isThereLengthChange = previousLength !== currentLength;
          previousLength = currentLength;
          return isThereLengthChange;
        })
      )
    ).pipe(
      tap(() => this.fc.priceCalculated.setValue(false)),
      concatMap(() => {
        const request: RegistrationPricingRequestDTO = {
          eventTermId: this.fc.eventTermId.value ?? -1,
          userEmail: this.fc.email.value,
          numberOfPeople: this.people.controls.length
        };
        return this.registrationHorizontService.calculatePriceForRegistration(request).pipe(
          catchError(() => of(null))
        );
      }),
      filter(res => !!res),
      tap(() => this.fc.priceCalculated.setValue(true)),
      tap(payment => this.payment.set(payment))
    ).subscribe();
  }

  get fc() {
    return this.form.controls;
  }

  get terms(): Array<EventTermPublicDTO> {
    return Array.from(this.event()?.terms?.values() ?? []);
  }

  get people() {
    return this.form.controls.people;
  }

  get knownPeople() {
    return this.form.controls.knownPeople;
  }

  get isOnlyOneChild() {
    return this.people.controls.length === 1;
  }

  get selectedTerm() {
    const eventTermId = this.fc.eventTermId.value;
    return find(this.terms, term => term.id === eventTermId);
  }

  protected hasError(form: AbstractControl, errorCode: string): boolean {
    return form.dirty && form.hasError(errorCode);
  }

  protected createPersonForm() {
    return this.fb.group({
      name: this.fb.control('', Validators.required),
      surname: this.fb.control('', Validators.required),
      dateOfBirth: this.fb.control<Date | null>(null, [Validators.required]),
      healthNotes: this.fb.control(''),
      foodAllergyNotes: this.fb.control(''),
      shirtSize: this.fb.control('', Validators.required),
      isIndependent: this.fb.control(false, Validators.required),
    })
  }

  protected createKnownPersonForm() {
    return this.fb.group({
      name: this.fb.control('', Validators.required),
      surname: this.fb.control('', Validators.required),
      relation: this.fb.control<string | null>(null, Validators.required)
    })
  }

  protected addPersonForm() {
    this.people.push(this.createPersonForm());
  }

  protected removePersonForm(index: number) {
    this.people.removeAt(index);
  }

  protected addKnownPersonForm() {
    this.knownPeople.push(this.createKnownPersonForm());
  }

  protected removeKnownPersonForm(index: number) {
    this.knownPeople.removeAt(index);
  }

  protected submitRegistration() {
    this.wasSubmitted = true;
    this.form.updateValueAndValidity();
    this.markAllAsDirty(this.form);

    of(this.form.valid).pipe(
      filter(valid => !!valid),
      tap(() => console.log('submitting form with data ', this.form.getRawValue()))
    ).subscribe();
  }

  private markAllAsDirty(form: AbstractControl) {
    if (form instanceof FormControl) {
      form.markAsDirty();
      return;
    }

    if (form instanceof FormArray) {
      const formArray = form as FormArray;
      formArray.markAsDirty();
      formArray.controls.forEach(control => this.markAllAsDirty(control))
    }

    if (form instanceof FormGroup) {
      const formGroup = form as FormGroup;
      formGroup.markAsDirty();
      Object.keys(formGroup.controls).forEach(key => this.markAllAsDirty(formGroup.controls[key]));
    }
  }
}
