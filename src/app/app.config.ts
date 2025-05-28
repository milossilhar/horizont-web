import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ApplicationConfig, DEFAULT_CURRENCY_CODE, importProvidersFrom, inject, LOCALE_ID, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { providePrimeNG } from 'primeng/config';

import { routes } from './app.routes';
import HorizontAppTheme from './app.theme';
import { HorizontApiModule } from './rest/api.module';
import { Configuration, ConfigurationParameters } from './rest/configuration';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HTTP_INTERCEPTOR_PROVIDERS } from './http/interceptors';
import { AuthConfig, OAuthService, provideOAuthClient } from 'angular-oauth2-oidc';
import { registerLocaleData } from '@angular/common';
import localeSk from '@angular/common/locales/sk';
import { sk } from './app.locale';
import { from, map, catchError, tap } from 'rxjs';

const OAUTH_CLIENT_CONFIG: AuthConfig = {
  issuer: `${window.location.origin}/api`,
  redirectUri: `${window.location.origin}/index.html`,
  postLogoutRedirectUri: `${window.location.origin}/index.html`,
  silentRefreshRedirectUri: `${window.location.origin}/silent-refresh.html`,
  clientId: 'horizon-web',
  responseType: 'code',
  scope: 'openid profile email',
  useSilentRefresh: true,
  // showDebugInformation: true,
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
    
    provideRouter(routes, withInMemoryScrolling({scrollPositionRestoration: 'top'})),
    
    providePrimeNG({
      ripple: true,
      translation: sk,
      theme: {
        preset: HorizontAppTheme,
        options: {
          darkModeSelector: false,
          cssLayer: {
            name: 'primeng',
            order: 'theme, base, primeng'
          }
        }
      }
    }),
    
    importProvidersFrom(HorizontApiModule.forRoot(() => new Configuration(API_CONFIG))),

    provideAppInitializer(() => {
      const oauthService = inject(OAuthService);
      oauthService.configure(OAUTH_CLIENT_CONFIG);

      return from(oauthService.loadDiscoveryDocumentAndTryLogin()).pipe(
        // delay(10000),
        tap(() => oauthService.setupAutomaticSilentRefresh()),
        map(() => true),
        catchError(err => {
          window.document.getElementById('intro-error')?.classList.remove('hidden');
          window.document.getElementById('intro-loading')?.classList.add('hidden');
          throw err;
        })
      );
    })
    
  ]
};
