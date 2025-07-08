import { Component, computed, OnInit, signal } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MessageModule } from 'primeng/message';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { HealthRestService } from '../../rest/api/health.service';
import { catchError, tap } from 'rxjs';
import { AuthService } from '../../shared/service/auth.service';
import { IfLoggedInDirective } from '../../shared/directives/if-logged-in.directive';

@Component({
  selector: 'app-header',
  imports: [
    ButtonModule,
    BreadcrumbModule,
    MenuModule,
    MessageModule,
    RouterLink, RouterLinkActive,
    IfLoggedInDirective
  ],
  templateUrl: './header.component.html',
  styles: ``
})
export class HeaderComponent implements OnInit {

  protected environment = signal<string | undefined>(undefined);

  protected loginButtonType: 'LOGIN' | 'LOGOUT' = 'LOGIN';

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

  loginLabels = {
    'LOGIN': 'Prihlásiť sa',
    'LOGOUT': 'Odhlásiť sa'
  }

  constructor(
    private router: Router,
    private authService: AuthService,
    private healthRestService: HealthRestService) { }

  ngOnInit(): void {
    this.healthRestService.getEnvironment().pipe(
      tap(env => this.environment.set(env.value)),
      catchError(() => this.router.navigateByUrl('/unavailable'))
    ).subscribe();

    this.authService.isLoggedIn.pipe(
      tap(loggedIn => this.loginButtonType = !loggedIn ? 'LOGIN' : 'LOGOUT')
    ).subscribe();
  }

  get loginButtonLabel() {
    return this.loginLabels[this.loginButtonType];
  }

  protected onLoginClick() {
    this.authService.toggleLogin();
  }

}
