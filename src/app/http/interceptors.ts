import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Provider } from '@angular/core';
import { ContentTypeInterceptor } from './content-type.interceptor';

export const HTTP_INTERCEPTOR_PROVIDERS: Provider[] = [
  { provide: HTTP_INTERCEPTORS, useClass: ContentTypeInterceptor, multi: true }
];