import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpenseRoutingModule } from './expense-routing.module';
import { HomeComponent } from './Components/Layout/home/home.component';
import { NavbarComponent } from './Components/Layout/navbar/navbar.component';
import { RecentPaymentComponent } from './Components/Payments/recent-payment/recent-payment.component';
import { NewTransactionComponent } from './Components/Payments/new-transaction/new-transaction.component';
import { TransactionListComponent } from './Components/Transactions/Lists/transaction-list/transaction-list.component';
import { TransactionFormComponent } from './Components/Transactions/Forms/transaction-form/transaction-form.component';
import { TransferformComponent } from './Components/Transactions/Forms/transferform/transferform.component';
import { NewTransferComponent } from './Components/Payments/new-transfer/new-transfer.component';
import { TransferListComponent } from './Components/Transactions/Lists/transfer-list/transfer-list.component';
import { UpdateTransferComponent } from './Components/Payments/@Angular_material/update-transfer/update-transfer.component';
import { ConfirmDeleteDialogComponent } from './Components/Payments/@Angular_material/confirm-delete-dialog/confirm-delete-dialog.component';
import { UpdateTransactionComponent } from './Components/Payments/@Angular_material/update-transaction/update-transaction.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { transactionReducer } from './@NgRx/Transactions/transaction.reducers';
import { transferReducer } from './@NgRx/Transfers/transfer.reducers';
import { EffectsModule } from '@ngrx/effects';
import { TransactionEffects } from './@NgRx/Transactions/transaction.effects';
import { TransferEffects } from './@NgRx/Transfers/transfer.effects';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './material/material.module';
import { LucidIconsModule } from '../lucid-icons/lucid-icons.module';
import { PlaygroundComponent } from './Components/Layout/playground/playground.component';

@NgModule({
  declarations: [
    HomeComponent,
    TransactionListComponent,
    TransactionFormComponent,
    NavbarComponent,
    TransferformComponent,
    RecentPaymentComponent,
    NewTransferComponent,
    TransferListComponent,
    UpdateTransferComponent,
    ConfirmDeleteDialogComponent,
    UpdateTransactionComponent,
    NewTransactionComponent,
    PlaygroundComponent,
  ],
  imports: [
    CommonModule,
    ExpenseRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule, //pagination module from npm
    RouterModule,
    MaterialModule, //Ffor all angular material
    StoreModule.forFeature('transactions', transactionReducer),
    StoreModule.forFeature('transfers', transferReducer),
    EffectsModule.forFeature([TransactionEffects, TransferEffects]), //to register effects
    LucidIconsModule,
  ],
  exports: [HomeComponent, NavbarComponent],
})
export class ExpenseModule {}
