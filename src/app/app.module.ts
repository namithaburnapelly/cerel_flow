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
import { HomeComponent } from './expense/Components/Layout/home/home.component';
import { RegisterComponent } from './Authentication/register/register.component';
import { authFactory } from './Authentication/utils/user_auth';
import { LoginResolve } from './Authentication/Service/login-resolve.service';
import { AuthGaurd } from './Authentication/Service/auth-gaurd.service';
import { JwtModule } from '@auth0/angular-jwt';
import { JWT_Module_Options } from './Authentication/utils/jwt_auth';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorHandlerService } from './expense/utils/error-handler';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { TransactionService } from './expense/Service/Transaction/transaction.service';
import { authInterceptor } from './Authentication/Service/auth.interceptor';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { transferReducer } from './expense/@NgRx/Transfers/transfer.reducers';
import { TransferService } from './expense/Service/Transfer/transfer.service';
import { TransferEffects } from './expense/@NgRx/Transfers/transfer.effects';
import { RecentPaymentComponent } from './expense/Components/Payments/recent-payment/recent-payment.component';
import { NewTransferComponent } from './expense/Components/Payments/new-transfer/new-transfer.component';
import { MatDialogModule } from '@angular/material/dialog';
import { UpdateTransferComponent } from './expense/Components/Payments/@Angular_material/update-transfer/update-transfer.component';
import { TransferformComponent } from './expense/Components/Transactions/Forms/transferform/transferform.component';
import { TransactionFormComponent } from './expense/Components/Transactions/Forms/transaction-form/transaction-form.component';
import { TransactionListComponent } from './expense/Components/Transactions/Lists/transaction-list/transaction-list.component';
import { TransferListComponent } from './expense/Components/Transactions/Lists/transfer-list/transfer-list.component';
import { ConfirmDeleteDialogComponent } from './expense/Components/Payments/@Angular_material/confirm-delete-dialog/confirm-delete-dialog.component';
import { UpdateTransactionComponent } from './expense/Components/Payments/@Angular_material/update-transaction/update-transaction.component';
import { NavbarComponent } from './expense/Components/Layout/navbar/navbar.component';
import { transactionReducer } from './expense/@NgRx/Transactions/transaction.reducers';
import { TransactionEffects } from './expense/@NgRx/Transactions/transaction.effects';
import { NewTransactionComponent } from './expense/Components/Payments/new-transaction/new-transaction.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    TransactionListComponent,
    TransactionFormComponent,
    RegisterComponent,
    NavbarComponent,
    PagenotfoundComponent,
    TransferformComponent,
    RecentPaymentComponent,
    NewTransferComponent,
    TransferListComponent,
    UpdateTransferComponent,
    ConfirmDeleteDialogComponent,
    UpdateTransactionComponent,
    NewTransactionComponent,
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
