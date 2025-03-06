import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { ChartsComponent } from '../charts/charts.component';
import { TransactionListComponent } from '../transaction-list/transaction-list.component';
import { PagenotfoundComponent } from '../pagenotfound/pagenotfound.component';
import { RecentPaymentComponent } from '../recent-payment/recent-payment.component';
import { TransactionsComponent } from '../transactions/transactions.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  { path: 'charts', component: ChartsComponent },
  { path: 'addTransaction', component: RecentPaymentComponent },
  { path: 'transactions', component: TransactionsComponent },
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
