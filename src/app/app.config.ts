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
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';
import { providePrimeNG } from 'primeng/config';

import { routes } from './app.routes';
import AppTheme from './app.theme';
import { RegistrationApiModule } from './rest/api.module';
import { Configuration, ConfigurationParameters } from './rest/configuration';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HTTP_INTERCEPTOR_PROVIDERS } from './http/interceptors';
import { registerLocaleData, ViewportScroller } from '@angular/common';
import localeSk from '@angular/common/locales/sk';
import { sk } from './app.locale';

import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import SuperTokens from 'supertokens-web-js';
import Session from 'supertokens-web-js/recipe/session';
import { AuthService } from './shared/service/auth.service';

const API_CONFIG: ConfigurationParameters = {
  basePath: '/api'
};

SuperTokens.init({
  appInfo: {
    appName: "Horizont Stránka",
    apiDomain: "http://localhost:8088",
    apiBasePath: '/api/supertokens'
  },
  recipeList: [
    Session.init()
  ]
})

registerLocaleData(localeSk, 'sk');

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimationsAsync(),

    { provide: LOCALE_ID, useValue: 'sk' },
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'EUR' },

    provideHttpClient(withInterceptorsFromDi()),
    HTTP_INTERCEPTOR_PROVIDERS,

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

      const authService = inject(AuthService);
      return authService.init();
    })

  ]
};
