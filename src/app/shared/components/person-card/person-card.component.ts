// import { Component, input } from '@angular/core';
// import { ButtonModule } from 'primeng/button';
// import { CardModule } from 'primeng/card';
// import { TagModule } from 'primeng/tag';
// import { CommonModule, DatePipe, NgIf } from '@angular/common';
// import { IndependentTagComponent } from "../tags/independent-tag/independent-tag.component";
// import { ExternalLinkComponent } from "../external-link/external-link.component";
// import { AvatarModule } from 'primeng/avatar';
//
// @Component({
//   selector: 'app-person-card',
//   imports: [
//     CommonModule, CardModule, TagModule, ButtonModule, AvatarModule,
//     IndependentTagComponent, DatePipe,
//     ExternalLinkComponent
// ],
//   templateUrl: './person-card.component.html',
//   styles: ``
// })
// export class PersonCardComponent {
//   public registration = input<RegistrationD>();
//   public person = input.required<Person>();
//
//   get initials(): string {
//     const firstInitial = this.person().name?.charAt(0)?.toUpperCase() || '';
//     const lastInitial = this.person().surname?.charAt(0)?.toUpperCase() || '';
//     return firstInitial + lastInitial;
//   }
//
//   getPersonId(): string {
//     // Generate a simple ID based on name and surname
//     return (this.person().name + this.person().surname).toLowerCase().replace(/\s+/g, '');
//   }
//
//   onEdit(): void {
//     // Implement edit functionality
//     console.log('Edit person:', this.person());
//   }
//
//   onView(): void {
//     // Implement view functionality
//     console.log('View person details:', this.person());
//   }
// }
