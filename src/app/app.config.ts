import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ApplicationConfig, DEFAULT_CURRENCY_CODE, importProvidersFrom, LOCALE_ID, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling, withRouterConfig } from '@angular/router';
import { providePrimeNG } from 'primeng/config';

import { routes } from './app.routes';
import HorizontAppTheme from './app.theme';
import { HorizontApiModule } from './rest/api.module';
import { Configuration, ConfigurationParameters } from './rest/configuration';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HTTP_INTERCEPTOR_PROVIDERS } from './http/interceptors';
import { registerLocaleData } from '@angular/common';
import localeSk from '@angular/common/locales/sk';
import { sk } from './app.locale';

const API_CONFIG: ConfigurationParameters = {
  basePath: 'http://localhost:8080/api'
};

registerLocaleData(localeSk, 'sk');

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withInterceptorsFromDi()),
    provideRouter(routes, withInMemoryScrolling({scrollPositionRestoration: 'top'})),
    provideAnimationsAsync(),
    providePrimeNG({
      ripple: true,
      translation: sk,
      theme: {
          preset: HorizontAppTheme,
          options: {
            darkModeSelector: false
          }
      }
    }),
    importProvidersFrom(HorizontApiModule.forRoot(() => new Configuration(API_CONFIG))),
    { provide: LOCALE_ID, useValue: 'sk' },
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'EUR' },
    HTTP_INTERCEPTOR_PROVIDERS
  ]
};
