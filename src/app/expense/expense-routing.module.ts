import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { ChartsComponent } from '../charts/charts.component';
import { TransactionListComponent } from '../transaction-list/transaction-list.component';
import { TransactionResolve } from '../Service/Transaction/transaction-resolve.service';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  { path: 'charts', component: ChartsComponent },
  {
    path: 'transaction/list',
    component: TransactionListComponent,
    resolve: { transactions: TransactionResolve },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExpenseRoutingModule {}
