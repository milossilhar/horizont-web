import { Component, computed, OnInit, signal } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MessageModule } from 'primeng/message';
import { Router, RouterLink } from '@angular/router';
import { HealthHorizontService } from '../../rest/api/health.service';
import { catchError, tap } from 'rxjs';

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
export class HeaderComponent implements OnInit {

  protected environment = signal<string | undefined>(undefined);

  protected isNotProd = computed(() => this.environment() && this.environment() !== 'prod');

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

  constructor(
    private router: Router,
    private healthHorizonService: HealthHorizontService) { }

  ngOnInit(): void {
    this.healthHorizonService.getEnvironment().pipe(
      tap(env => this.environment.set(env.value)),
      catchError(() => this.router.navigateByUrl('/unavailable'))
    ).subscribe();
  }

  

}
