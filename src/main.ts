import '@angular/compiler';
import 'zone.js';
import { ErrorHandler } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app-routing.module';
import { ErrorHandlerService } from './app/shared/services/error-handler.service';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    { provide: ErrorHandler, useClass: ErrorHandlerService },
  ],
}).catch(err => console.error(err));
