import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './Components/Layout/home/home.component';
import { PagenotfoundComponent } from '../pagenotfound/pagenotfound.component';
import { RecentPaymentComponent } from './Components/Payments/recent-payment/recent-payment.component';
import { TransactionListComponent } from './Components/Transactions/Lists/transaction-list/transaction-list.component';
import { TransferListComponent } from './Components/Transactions/Lists/transfer-list/transfer-list.component';
import { transactionsResolver } from './@NgRx/Transactions/transactions.resolver';
import { transfersResolver } from './@NgRx/Transfers/transfers.resolver';
import { DashboardComponent } from './Components/Layout/dashboard/dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: 'dashboard', component: HomeComponent },
      { path: 'addTransaction', component: RecentPaymentComponent },
      { path: 'transactions', component: TransactionListComponent },
      { path: 'transfers', component: TransferListComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
    resolve: {
      transactions: transactionsResolver,
      transfers: transfersResolver,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExpenseRoutingModule {}
