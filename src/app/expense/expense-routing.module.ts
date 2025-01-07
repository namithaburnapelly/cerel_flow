import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { ChartsComponent } from '../charts/charts.component';
import { TransactionFormComponent } from '../transaction-form/transaction-form.component';
import { TransactionListComponent } from '../transaction-list/transaction-list.component';
import { AuthGaurd } from '../Service/Auth/auth-gaurd.service';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
  },
  { path: 'charts', component: ChartsComponent },
  { path: 'transaction/form', component: TransactionFormComponent },
  {
    path: 'transaction/list',
    component: TransactionListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExpenseRoutingModule {}
