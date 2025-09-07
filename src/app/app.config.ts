import { ApplicationConfig, ErrorHandler, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { CustomErrorService } from './Services/custom-error.service';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import { authInterceptor } from './interceptors/auth.interceptor';


export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideClientHydration(), 
    provideHttpClient(withInterceptors([authInterceptor])),
    {provide: ErrorHandler, useClass: CustomErrorService}]
};
