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
import { authInterceptor } from './Service/Auth/auth.interceptor';
import { NavbarComponent } from './navbar/navbar.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { NewTransactionComponent } from './transaction-list/new-transaction/new-transaction.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { transferReducer } from './@Ngrx/Transfers/transfer.reducers';
import { TransferService } from './Service/Transfer/transfer.service';
import { TransferEffects } from './@Ngrx/Transfers/transfer.effects';
import { TransferformComponent } from './transferform/transferform.component';
import { RecentPaymentComponent } from './recent-payment/recent-payment.component';
import { NewTransferComponent } from './recent-payment/new-transfer/new-transfer.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { TransferListComponent } from './transactions/transfer-list/transfer-list.component';
import { UpdateTransferComponent } from './@Angular_material/update-transfer/update-transfer.component';
import { ConfirmDeleteDialogComponent } from './@Angular_material/confirm-delete-dialog/confirm-delete-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';

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
    TransferformComponent,
    RecentPaymentComponent,
    NewTransferComponent,
    TransactionsComponent,
    TransferListComponent,
    UpdateTransferComponent,
    ConfirmDeleteDialogComponent,
  ],
  imports: [
    BrowserModule,
    NgxPaginationModule, //pagination module from npm
    ReactiveFormsModule,
    RouterModule,
    AppRoutingModule,
    FormsModule,
    MatDialogModule,
    JwtModule.forRoot(JWT_Module_Options),
    StoreModule.forRoot({
      transactions: transactionReducer,
      transfers: transferReducer,
    }),
    EffectsModule.forRoot([TransactionEffects, TransferEffects]), //to register effects
  ],
  providers: [
    //provide custom error handler class to app module.
    { provide: ErrorHandler, useClass: ErrorHandlerService },
    AuthService,
    LoginResolve,
    AuthGaurd,
    TransactionService,
    TransferService,
    provideHttpClient(withInterceptors([authInterceptor])),
    // { provide: HTTP_INTERCEPTORS, useValue: authInterceptor, multi: true },
    //ensures the authentication is setup before any other services or components are initialized
    provideAppInitializer(() => authFactory(inject(AuthService))),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
