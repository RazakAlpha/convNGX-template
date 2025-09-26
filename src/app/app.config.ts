import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideConvexAngular } from '@razakalpha/convngx';

import { routes } from './app.routes';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideConvexAngular({
      convexUrl: environment.convexUrl,
      authBaseURL: environment.authBaseURL,
      authSkewMs: environment.authSkewMs,
      keep: environment.keep,
    }),
  ],
};
