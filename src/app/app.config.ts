import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  ApplicationConfig,
  DEFAULT_CURRENCY_CODE,
  importProvidersFrom,
  inject,
  LOCALE_ID,
  provideAppInitializer,
  provideZoneChangeDetection
} from '@angular/core';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling, withViewTransitions } from '@angular/router';
import { providePrimeNG } from 'primeng/config';

import { routes } from './app.routes';
import AppTheme from './app.theme';
import { RegistrationApiModule } from './rest/api.module';
import { Configuration, ConfigurationParameters } from './rest/configuration';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HTTP_INTERCEPTOR_PROVIDERS } from './http/interceptors';
import { AuthConfig, OAuthService, provideOAuthClient } from 'angular-oauth2-oidc';
import { registerLocaleData, ViewportScroller } from '@angular/common';
import localeSk from '@angular/common/locales/sk';
import { sk } from './app.locale';
import { from, map, catchError, tap, of, throwError } from 'rxjs';

import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmationService, MessageService } from 'primeng/api';

const OAUTH_CLIENT_CONFIG: AuthConfig = {
  issuer: `${window.location.origin}/api`,
  redirectUri: `${window.location.origin}/index.html`,
  postLogoutRedirectUri: `${window.location.origin}/index.html`,
  silentRefreshRedirectUri: `${window.location.origin}/silent-refresh.html`,
  clientId: 'horizon-web',
  responseType: 'code',
  scope: 'openid profile email',
  useSilentRefresh: true,
  showDebugInformation: true,
};

const API_CONFIG: ConfigurationParameters = {
  basePath: '/api'
};

registerLocaleData(localeSk, 'sk');

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimationsAsync(),

    { provide: LOCALE_ID, useValue: 'sk' },
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'EUR' },

    provideHttpClient(withInterceptorsFromDi()),
    HTTP_INTERCEPTOR_PROVIDERS,
    provideOAuthClient({
      resourceServer: {
        allowedUrls: ['/api'],
        sendAccessToken: true
      }
    }),

    provideRouter(routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled'
      }),
      withComponentInputBinding()
    ),

    providePrimeNG({
      ripple: true,
      translation: sk,
      theme: {
        preset: AppTheme,
        options: {
          darkModeSelector: false,
          cssLayer: {
            name: 'primeng',
            order: 'theme, base, primeng'
          }
        }
      }
    }),

    MessageService, ConfirmationService, DialogService,
    importProvidersFrom(RegistrationApiModule.forRoot(() => new Configuration(API_CONFIG))),

    provideAppInitializer(() => {
      const viewportScroller = inject(ViewportScroller);
      viewportScroller.setOffset([0, 80]);

      const oauthService = inject(OAuthService);
      oauthService.configure(OAUTH_CLIENT_CONFIG);

      return from(oauthService.loadDiscoveryDocumentAndTryLogin()).pipe(
        tap(() => oauthService.setupAutomaticSilentRefresh()),
        map(() => true),
        catchError(err => {
          window.document.getElementById('intro-error')?.classList.remove('hidden');
          window.document.getElementById('intro-loading')?.classList.add('hidden');
          return throwError(() => err);
        })
      );
    })

  ]
};
