// registration-card.component.ts
import { Component, inject, Input, output, signal } from '@angular/core';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { BadgeModule } from 'primeng/badge';
import { IndependentTagComponent } from '../../shared/components/tags/independent-tag/independent-tag.component';
import { ConsentTagComponent } from '../../shared/components/tags/consent-tag/consent-tag.component';
import { ExternalLinkComponent } from '../../shared/components/external-link/external-link.component';
import { EnumPipe } from '../../shared/pipes/enum.pipe';
import { RegistrationDTO } from '../../rest/model/models';
import { BooleanTagComponent } from "../../shared/components/tags/boolean-tag/boolean-tag.component";
import { CurrencyPipe, DatePipe, PercentPipe } from '@angular/common';
import { DefaultPipe } from "../../shared/pipes/default.pipe";
import { RegistrationHorizontService } from '../../rest/api/registration.service';
import { catchError, concatMap, filter, finalize, of, tap } from 'rxjs';
import { DialogService } from '../../shared/service/dialog.service';
import { ToastService } from '../../shared/service/toast.service';


@Component({
  selector: 'app-registration-card',
  standalone: true,
  imports: [
    CardModule, TagModule, DividerModule, ButtonModule, TooltipModule, BadgeModule,
    IndependentTagComponent, ConsentTagComponent, ExternalLinkComponent, BooleanTagComponent,
    DatePipe, CurrencyPipe, EnumPipe, PercentPipe, DefaultPipe
  ],
  providers: [ CurrencyPipe ],
  templateUrl: './registration-card.component.html',
  styles: []
})
export class RegistrationCardComponent {

  @Input() registration!: RegistrationDTO;

  public registrationUpdate = output<RegistrationDTO>();

  protected loading = signal<boolean>(false);

  constructor(
    private registrationHorizontService: RegistrationHorizontService,
    private dialogService: DialogService,
    private toastService: ToastService,
    private currencyPipe: CurrencyPipe
  ) {}

  get statusSeverity(): 'contrast' | 'success' | 'info' | 'warn' | 'danger' {
    switch(this.registration.status) {
      case 'CONFIRMED':
        return 'success';
      case 'QUEUE':
        return 'warn';
      case 'CONCEPT':
        return 'danger';
      default:
        return 'contrast';
    }
  }

  get statusText(): string {
    switch(this.registration.status) {
      case 'CONFIRMED':
        return 'Potvrdené';
      case 'QUEUE':
        return 'V poradí';
      case 'CONCEPT':
        return 'Nepotvrdené';
      default:
        return 'Neznámy';
    }
  }

  get payment() {
    return this.registration.payment;
  }

  get deposit() {
    return this.currencyPipe.transform(this.payment?.deposit);
  }

  get discountPercent() {
    if (!this.payment?.discountPercent) return null;
    return this.payment.discountPercent / 100;
  }

  get emailHref(): string {
    return `mailto${this.registration.email}`;
  }

  get telPhoneHref(): string {
    return `tel:${this.registration.telPhone}`;
  }

  protected getDiscountPercent() {
    return this.payment?.discountPercent || undefined;
  }

  protected getPaymentButtonText(): string {
    if (!!this.payment?.hasDeposit && !!this.payment?.depositPaid) {
      return 'Potvrď zvyšnú platbu';
    }
    return 'Potvrď celú platbu';
  }

  protected paidClick(event: Event, deposit: boolean) {
    const message = `Potvrdiť zálohu ${this.deposit} pre platbu ${this.payment?.variableSymbol}`;
    this.dialogService.confirmDialog(event, message, "Potvrdenie").pipe(
      filter(r => r),
      tap(() => this.loading.set(true)),
      concatMap(() => this.registrationHorizontService.confirmPayment(this.payment?.id ?? 0, deposit).pipe(
        catchError(() => {
          // log error to user
          this.toastService.error(`Potvrdenie zálohy sa nepodarilo.`, 'CHYBA');
          return of(null);
        })
      )),
      filter(r => !!r),
      tap(updatedReg => {
        if (updatedReg.emailPaymentConfirmSent) {
          this.toastService.success(`Záloha ${this.deposit} úspešne potvrdená.`, 'ÚSPECH');
        } else {
          this.toastService.warn(`Záloha ${this.deposit} sa potvrdila, ale nastala CHYBA pri odoslaní EMAIL-u.`, 'CHYBA E-MAIL');
        }
        this.registrationUpdate.emit(updatedReg);
      }),
      finalize(() => this.loading.set(false))
    ).subscribe();
  }
}