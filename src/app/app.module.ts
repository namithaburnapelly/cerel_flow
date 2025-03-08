import {
  ErrorHandler,
  inject,
  NgModule,
  provideAppInitializer,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './Authentication/login/login.component';
import { AuthService } from './Authentication/Service/auth.service';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { RegisterComponent } from './Authentication/register/register.component';
import { authFactory } from './Authentication/utils/user_auth';
import { LoginResolve } from './Authentication/Service/login-resolve.service';
import { AuthGaurd } from './Authentication/Service/auth-gaurd.service';
import { JwtModule } from '@auth0/angular-jwt';
import { JWT_Module_Options } from './Authentication/utils/jwt_auth';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorHandlerService } from './expense/utils/error-handler';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { TransactionService } from './expense/Service/Transaction/transaction.service';
import { authInterceptor } from './Authentication/Service/auth.interceptor';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { TransferService } from './expense/Service/Transfer/transfer.service';
import { ExpenseModule } from './expense/expense.module';
import { NotificationService } from './expense/Service/Notification/notification.service';
import { MaterialModule } from './expense/material/material.module';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    PagenotfoundComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    JwtModule.forRoot(JWT_Module_Options),
    ReactiveFormsModule,
    FormsModule,
    EffectsModule.forRoot([]), // Make sure EffectsModule is initialized
    StoreModule.forRoot({}), //This initializes NgRx Store globally
    ExpenseModule,
    MaterialModule,
  ],
  providers: [
    //provide custom error handler class to app module.
    { provide: ErrorHandler, useClass: ErrorHandlerService },
    AuthService,
    LoginResolve,
    AuthGaurd,
    TransactionService,
    TransferService,
    NotificationService,
    provideHttpClient(withInterceptors([authInterceptor])),
    // { provide: HTTP_INTERCEPTORS, useValue: authInterceptor, multi: true },
    //ensures the authentication is setup before any other services or components are initialized
    provideAppInitializer(() => authFactory(inject(AuthService))),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
