import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [
    RouterLink
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {

  protected socialLinks = [
    { name: 'Facebook', icon: 'pi pi-facebook', url: 'https://www.facebook.com/p/Leziemevpezinku-100063969228551/' },
    { name: 'Twitter', icon: 'pi pi-twitter', url: 'https://twitter.com' },
    { name: 'Instagram', icon: 'pi pi-instagram', url: 'https://instagram.com' }
  ]

  protected links = [
    { label: 'O Klube', routerLink: ['/home'], fragment: 'intro' },
    { label: 'Novinky', routerLink: ['/blog'] },
    { label: 'Galéria', routerLink: ['/home'], fragment: 'gallery' },
    { label: 'Tím', routerLink: ['/home'], fragment: 'team' },
    { label: 'Klubová Aplikácia', routerLink: ['/app'] }
  ];

  get currentYear() {
    return new Date().getFullYear();
  }
}
