import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MessageModule } from 'primeng/message';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [
    ButtonModule,
    BreadcrumbModule,
    MenuModule,
    MessageModule,
    RouterLink,
  ],
  templateUrl: './header.component.html',
  styles: ``
})
export class HeaderComponent {

  loginItems: MenuItem[] = [
    { label: 'Môj profil' },
    { label: 'Nastavenie' },
    { label: 'Odhlásiť' }
  ]

  shareItems: MenuItem[] = [
    { label: "Facebook", icon: 'pi pi-facebook' },
    { label: "Instagram", icon: 'pi pi-instagram' },
    { label: "WhatsApp", icon: 'pi pi-whatsapp' },
    { label: "E-Mail", icon: 'pi pi-envelope' },
  ]

}
