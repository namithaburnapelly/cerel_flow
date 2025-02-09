import {
  ErrorHandler,
  inject,
  NgModule,
  provideAppInitializer,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AuthService } from './Service/Auth/auth.service';
import { provideHttpClient } from '@angular/common/http';
import { HomeComponent } from './home/home.component';
import { TransactionListComponent } from './transaction-list/transaction-list.component';
import { TransactionFormComponent } from './transaction-form/transaction-form.component';
import { ChartsComponent } from './charts/charts.component';
import { AuthComponent } from './auth/auth.component';
import { RegisterComponent } from './register/register.component';
import { authFactory } from './Global variables/user_auth';
import { LoginResolve } from './Service/Auth/login-resolve.service';
import { AuthGaurd } from './Service/Auth/auth-gaurd.service';
import { JwtModule } from '@auth0/angular-jwt';
import { JWT_Module_Options } from './Global variables/jwt_auth';
import { ReactiveFormsModule } from '@angular/forms';
import { ErrorHandlerService } from './ErrorHandling/error-handler';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    TransactionListComponent,
    TransactionFormComponent,
    ChartsComponent,
    AuthComponent,
    RegisterComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    AppRoutingModule,
    JwtModule.forRoot(JWT_Module_Options),
  ],
  providers: [
    //provide custom error handler class to app module.
    { provide: ErrorHandler, useClass: ErrorHandlerService },
    AuthService,
    LoginResolve,
    AuthGaurd,
    provideHttpClient(),
    //ensures the authentication is setup before any other services or components are initialized
    provideAppInitializer(() => authFactory(inject(AuthService))),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
