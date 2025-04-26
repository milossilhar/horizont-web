import { AsyncPipe, CurrencyPipe, DatePipe, JsonPipe } from '@angular/common';
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
import { ActivatedRoute, Router } from '@angular/router';
import { EventCardComponent } from '../event-card/event-card.component';
import { catchError, concatMap, filter, finalize, map, merge, of, switchMap, takeUntil, tap, timer } from 'rxjs';
import { CardModule } from 'primeng/card';
import { EventTermSelectorComponent } from "../../shared/form/event-term-selector/event-term-selector.component";
import { EventPublicDTO } from '../../rest/model/event-public';
import { EventTermPublicDTO } from '../../rest/model/event-term-public';
import { ButtonModule } from 'primeng/button';
import { MeterGroupModule } from 'primeng/metergroup';
import { SelectModule } from 'primeng/select';
import { find, some } from 'lodash';
import { MessageModule } from 'primeng/message';
import { PRIME_CONSTANTS } from '../../shared/primeng.constant';
import { PaymentDTO } from '../../rest/model/payment';
import { RegistrationHorizontService } from '../../rest/api/api';
import { RegistrationPricingRequestDTO } from '../../rest/model/registration-pricing-request';
import { EventTermCapacityResponseDTO } from '../../rest/model/event-term-capacity-response';
import { EnumerationService } from '../../shared/service/enumeration.service';
import { EnumerationItemDTO } from '../../rest/model/enumeration-item';
import { ProgressBar } from 'primeng/progressbar';
import { RegistrationPublicDTO } from '../../rest/model/registration-public';
import { RegistrationDTO } from '../../rest/model/registration';

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
    ProgressBar,
    SelectModule,
    MeterGroupModule,
    EventCardComponent,
    DatePipe, CurrencyPipe, AsyncPipe,
    EventTermSelectorComponent
],
  templateUrl: './registration-form.component.html',
  styles: ``
})
export class RegistrationFormComponent extends Destroyable implements OnInit {
  protected today = new Date();

  protected event = signal<EventPublicDTO | undefined>(undefined);
  protected capacity = signal<EventTermCapacityResponseDTO | undefined>(undefined);
  protected isAnyPersonDependent = signal(true);
  
  protected consentPhotoOptions = PRIME_CONSTANTS.selectbutton.yesno.boolean;

  protected form;

  protected wasSubmitted = false;
  protected creatingRegistration = false;
  protected registrationError = '';

  protected payment: WritableSignal<PaymentDTO> = signal({ price: 0 });
  
  constructor(
    private fb: NonNullableFormBuilder,
    private route: ActivatedRoute, private router: Router,
    private enumerationService: EnumerationService,
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
      consentGDPR: this.fb.control<boolean>(false, Validators.requiredTrue),
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

    // remove error after false submit
    this.form.valueChanges.pipe(
      filter(() => !!this.registrationError),
      tap(() => this.registrationError = ''),
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

  get relations() {
    return this.enumerationService.getEnum(EnumerationItemDTO.EnumNameEnum.RegERelation);
  }
  
  get shirtSizes() {
    return this.enumerationService.getEnum(EnumerationItemDTO.EnumNameEnum.RegEShirtSize);
  }

  protected hasError(form: AbstractControl, errorCode: string): boolean {
    return form.dirty && form.hasError(errorCode);
  }

  protected createPersonForm() {
    return this.fb.group({
      name: this.fb.control('', Validators.required),
      surname: this.fb.control('', Validators.required),
      dateOfBirth: this.fb.control('', [Validators.required]),
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
      relation: this.fb.control('', Validators.required)
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

  protected getChildText(childForm: FormGroup) {
    childForm
  }

  protected submitRegistration() {
    this.wasSubmitted = true;
    this.form.updateValueAndValidity();
    this.markAllAsDirty(this.form);

    of(this.form.valid).pipe(
      filter(valid => !!valid),
      map(() => {
        return {
          eventTermId: this.fc.eventTermId.value ?? 0,
          request: this.createRequest()
        }
      }),
      tap(() => {
        this.form.disable();
        this.creatingRegistration = true;
      }),
      concatMap(({eventTermId, request}) => this.registrationHorizontService
        .createRegistration(eventTermId, request).pipe(
          catchError(err => {
            console.error(`Error creating registration: ${JSON.stringify(request, null, 2)}`, err);
            if (err.status === 409) {
              this.registrationError = 'Registrácia na zvolený termín pre minimálne jednu registrovanú osobu už existuje.';
            } else {
              this.registrationError = 'Registrácia sa nepodarila. V prípade, že Vám registrácia nefunguje napíšte mail na info&#64;leziemevpezinku.sk.';
            }
            return of(undefined);
          })
        )),
      filter(createdReg => !!createdReg),
      tap(createdReg => {
        if (createdReg.status === RegistrationDTO.StatusEnum.Concept) {
          this.router.navigate(['registration', 'result', 'success']);
        }
        if (createdReg.status === RegistrationDTO.StatusEnum.Queue) {
          this.router.navigate(['registration', 'result', 'queue']);
        }
      }),
      finalize(() => {
        this.creatingRegistration = false;
        this.form.enable();
      })
    ).subscribe();
  }

  private createRequest(): RegistrationPublicDTO {
    return {
      name: this.fc.name.value,
      surname: this.fc.surname.value,
      email: this.fc.email.value,
      telPhone: this.fc.telPhone.value,
      consentGDPR: this.fc.consentGDPR.value,
      consentPhoto: this.fc.consentPhoto.value ?? false,
      people: this.fc.people.getRawValue(),
      knownPeople: this.knownPeople.getRawValue()
    };
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
