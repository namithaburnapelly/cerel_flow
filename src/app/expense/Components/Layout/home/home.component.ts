import { Component, inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Transaction } from '../../../Model/transaction.model';
import { Transfer } from '../../../Model/transfer.model';
import { select, Store } from '@ngrx/store';
import { selectTransactions } from '../../../@NgRx/Transactions/transaction.selectors';
import { selectTransfers } from '../../../@NgRx/Transfers/transfer.selectors';
import {
  selectNetBalance,
  selectTotalExpenses,
  selectTotalIncome,
} from '../../../@NgRx/FinancialSummary/financial-sumary.selectors';
import { loadTransactions } from '../../../@NgRx/Transactions/transaction.actions';
import { AuthService } from '../../../../Authentication/Service/auth.service';
import { loadTransfers } from '../../../@NgRx/Transfers/transfer.actions';

@Component({
  selector: 'app-home',
  standalone: false,

  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  today: Date = new Date();

  transactions$: Observable<Transaction[]>;
  transfers$: Observable<Transfer[]>;
  totalIncome$: Observable<number>;
  totalExpenses$: Observable<number>;
  netBalance$: Observable<number>;

  private store = inject(Store);
  private authService = inject(AuthService);
  constructor() {
    this.transactions$ = this.store.select(selectTransactions);
    this.transfers$ = this.store.select(selectTransfers);
    this.totalIncome$ = this.store.select(selectTotalIncome);
    this.totalExpenses$ = this.store.select(selectTotalExpenses);
    this.netBalance$ = this.store.select(selectNetBalance);
  }

  ngOnInit(): void {
    loadTransactions({
      payload: {
        userId: this.authService.getUserId(),
        page: 1,
        pageSize: 5,
        sortOrder: 'date_desc',
      },
    });
    loadTransfers({
      payload: {
        userId: this.authService.getUserId(),
        page: 1,
        pageSize: 5,
        sortOrder: 'date_desc',
      },
    });
  }
}
