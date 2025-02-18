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
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HomeComponent } from './home/home.component';
import { TransactionListComponent } from './transaction-list/transaction-list.component';
import { TransactionFormComponent } from './transaction-list/transaction-form/transaction-form.component';
import { ChartsComponent } from './charts/charts.component';
import { AuthComponent } from './auth/auth.component';
import { RegisterComponent } from './register/register.component';
import { authFactory } from './Global variables/user_auth';
import { LoginResolve } from './Service/Auth/login-resolve.service';
import { AuthGaurd } from './Service/Auth/auth-gaurd.service';
import { JwtModule } from '@auth0/angular-jwt';
import { JWT_Module_Options } from './Global variables/jwt_auth';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorHandlerService } from './ErrorHandling/error-handler';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { transactionReducer } from './@Ngrx/transaction.reducers';
import { TransactionEffects } from './@Ngrx/transaction.effects';
import { EffectsModule } from '@ngrx/effects';
import { TransactionService } from './Service/Transaction/transaction.service';
import { TransactionResolve } from './Service/Transaction/transaction-resolve.service';
import { authInterceptor } from './Service/Auth/auth.interceptor';
import { NavbarComponent } from './navbar/navbar.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { NewTransactionComponent } from './transaction-list/new-transaction/new-transaction.component';

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
    NavbarComponent,
    PagenotfoundComponent,
    NewTransactionComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    RouterModule,
    AppRoutingModule,
    FormsModule,
    JwtModule.forRoot(JWT_Module_Options),
    StoreModule.forRoot({ transactions: transactionReducer }),
    EffectsModule.forRoot([TransactionEffects]), //to register effects
  ],
  providers: [
    //provide custom error handler class to app module.
    { provide: ErrorHandler, useClass: ErrorHandlerService },
    AuthService,
    LoginResolve,
    TransactionResolve,
    AuthGaurd,
    TransactionService,
    provideHttpClient(withInterceptors([authInterceptor])),
    // { provide: HTTP_INTERCEPTORS, useValue: authInterceptor, multi: true },
    //ensures the authentication is setup before any other services or components are initialized
    provideAppInitializer(() => authFactory(inject(AuthService))),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
