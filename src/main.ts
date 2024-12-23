import { enableProdMode, importProvidersFrom } from '@angular/core';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';


import { AppComponent } from './app/app.component';
import { AppRoutingModule } from './app/app-routing.module';

import { environment } from './environments/environment';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(AppRoutingModule, BrowserModule),
        provideAnimations(),
        provideHttpClient(withInterceptorsFromDi())
    ]
}).catch(err => console.error(err));
