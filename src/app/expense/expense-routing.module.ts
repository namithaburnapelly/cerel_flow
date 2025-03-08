import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './Components/Layout/home/home.component';
import { PagenotfoundComponent } from '../pagenotfound/pagenotfound.component';
import { RecentPaymentComponent } from './Components/Payments/recent-payment/recent-payment.component';
import { TransactionListComponent } from './Components/Transactions/Lists/transaction-list/transaction-list.component';
import { TransferListComponent } from './Components/Transactions/Lists/transfer-list/transfer-list.component';
import { transactionsResolver } from './@NgRx/Transactions/transactions.resolver';
import { transfersResolver } from './@NgRx/Transfers/transfers.resolver';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    resolve: {
      transactions: transactionsResolver,
      transfers: transfersResolver,
    },
  },
  { path: 'addTransaction', component: RecentPaymentComponent },
  { path: 'transactions', component: TransactionListComponent },
  { path: 'transfers', component: TransferListComponent },
  {
    path: 'transaction/list',
    component: TransactionListComponent,
  },
  { path: '**', component: PagenotfoundComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExpenseRoutingModule {}
