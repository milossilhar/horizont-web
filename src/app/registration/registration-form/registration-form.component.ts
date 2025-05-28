import { AsyncPipe, CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, OnInit, signal, WritableSignal } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DatePickerModule } from 'primeng/datepicker';
import { TextareaModule } from 'primeng/textarea';
import { TooltipModule } from 'primeng/tooltip';
import { CheckboxModule } from 'primeng/checkbox';
import { DestroyableComponent } from '../../shared/base/destroyable.component';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, concatMap, filter, finalize, map, merge, of, takeUntil, tap } from 'rxjs';
import { CardModule } from 'primeng/card';
import { EventTermSelectorComponent } from "../../shared/form/event-term-selector/event-term-selector.component";
import { ButtonModule } from 'primeng/button';
import { MeterGroupModule } from 'primeng/metergroup';
import { SelectModule } from 'primeng/select';
import { find, some } from 'lodash';
import { MessageModule } from 'primeng/message';
import { PRIME_CONSTANTS } from '../../shared/primeng.constant';
import { PublicHorizontService } from '../../rest/api/api';
import { EnumerationService } from '../../shared/service/enumeration.service';
import { ProgressBar } from 'primeng/progressbar';
import { EnumerationItemPublicDTO, EventEventPublicDTO, PaymentPublicDTO, RegistrationPricingRequestPublicDTO, RegistrationPublicDTO } from '../../rest/model/models';
import { EventCardComponent } from '../../event/event-card/event-card.component';

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
export class RegistrationFormComponent extends DestroyableComponent implements OnInit {
  protected today = new Date();

  protected event = signal<EventEventPublicDTO | undefined>(undefined);
  protected isAnyPersonDependent = signal(true);
  protected selectedTermID = signal<number>(-1);
  
  protected consentPhotoOptions = PRIME_CONSTANTS.selectbutton.yesno.boolean;

  protected form;

  protected wasSubmitted = false;
  protected creatingRegistration = false;
  protected registrationError = '';

  protected payment: WritableSignal<PaymentPublicDTO> = signal({ price: 0 });

  protected terms = computed(() => Array.from(this.event()?.terms?.values() ?? []));

  protected selectedTerm = computed(() => {
    const eventTermId = this.selectedTermID();
    return find(this.terms(), term => term.id === eventTermId);
  });
  
  constructor(
    private fb: NonNullableFormBuilder,
    private route: ActivatedRoute, private router: Router,
    private enumerationService: EnumerationService,
    private publicHorizontService: PublicHorizontService,
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

    this.publicHorizontService.getEventByUUID(eventUUID).pipe(
      tap(event => this.event.set(event))
    ).subscribe();

    // update isAnyPersonDependent
    this.people.valueChanges.pipe(
      map(value => some(value, p => !p.isIndependent)),
      tap(isAnyPersonDependent => this.isAnyPersonDependent.set(isAnyPersonDependent)),
      takeUntil(this.destroy$)
    ).subscribe();

    // update selectedTermID
    this.fc.eventTermId.valueChanges.pipe(
      tap(id => { if (!!id) this.selectedTermID.set(id); }),
      takeUntil(this.destroy$)
    ).subscribe();

    // remove error after false submit
    // this.form.valueChanges.pipe(
    //   filter(() => !!this.registrationError),
    //   tap(() => this.registrationError = ''),
    //   takeUntil(this.destroy$)
    // ).subscribe();

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
        const request: RegistrationPricingRequestPublicDTO = {
          userEmail: this.fc.email.value,
          numberOfPeople: this.people.controls.length
        };
        return this.publicHorizontService.calculatePriceForRegistration(this.fc.eventTermId.value ?? 0, request).pipe(
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

  get people() {
    return this.form.controls.people;
  }

  get knownPeople() {
    return this.form.controls.knownPeople;
  }

  get isOnlyOneChild() {
    return this.people.controls.length === 1;
  }

  get relations() {
    return this.enumerationService.getEnum(EnumerationItemPublicDTO.EnumNameEnum.RegERelation);
  }
  
  get shirtSizes() {
    return this.enumerationService.getEnum(EnumerationItemPublicDTO.EnumNameEnum.RegEShirtSize);
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

  protected submitRegistration() {
    this.wasSubmitted = true;
    this.registrationError = '';
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
      concatMap(({eventTermId, request}) => this.publicHorizontService
        .createRegistration(eventTermId, request).pipe(
          catchError(err => {
            console.error(`Error creating registration: ${JSON.stringify(request, null, 2)}`, err);
            if (err.status === 409) {
              this.registrationError = 'Registrácia na zvolený termín pre minimálne jednu registrovanú osobu už existuje.';
            } else {
              this.registrationError = 'Registrácia sa nepodarila. V prípade, že Vám registrácia nefunguje napíšte mail na info@leziemevpezinku.sk.';
            }
            return of(undefined);
          })
        )),
      filter(createdReg => !!createdReg),
      tap(createdReg => {
        if (createdReg.status === RegistrationPublicDTO.StatusEnum.Queue) {
          this.router.navigate(['registration', 'result', 'queue']);
        } else {
          this.router.navigate(['registration', 'result', 'success']);
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
