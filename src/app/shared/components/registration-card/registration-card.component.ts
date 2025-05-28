// registration-card.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { BadgeModule } from 'primeng/badge';
import { KnownPersonDTO, RegistrationDTO } from '../../../rest/model/models';
import { IndependentTagComponent } from "../tags/independent-tag/independent-tag.component";
import { ConsentTagComponent } from "../tags/consent-tag/consent-tag.component";
import { ExternalLinkComponent } from "../external-link/external-link.component";
import { EnumPipe } from "../../pipes/enum.pipe";

@Component({
  selector: 'app-registration-card',
  standalone: true,
  imports: [
    CommonModule, CardModule, TagModule, DividerModule, ButtonModule, TooltipModule, BadgeModule,
    DatePipe,
    IndependentTagComponent,
    ConsentTagComponent,
    ExternalLinkComponent,
    EnumPipe
],
  templateUrl: './registration-card.component.html',
  styles: []
})
export class RegistrationCardComponent {

  @Input() registration!: RegistrationDTO;

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

  get emailHref(): string {
    return `mailto${this.registration.email}`;
  }

  get telPhoneHref(): string {
    return `tel:${this.registration.telPhone}`;
  }

  trackByKnownPersonName(index: number, person: KnownPersonDTO): string {
    return `${person.name}-${person.surname}-${person.relation}-${index}`;
  }
}