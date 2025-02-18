import { Component, inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Transaction } from '../Model/transaction.model';
import { Store } from '@ngrx/store';
import {
  selectError,
  selectLoading,
  selectTransactions,
} from '../@Ngrx/transaction.selectors';
import {
  addTransaction,
  deleteTransaction,
  updateTransaction,
} from '../@Ngrx/transaction.actions';
import { TransactionState } from '../@Ngrx/transaction.state';
import { AuthService } from '../Service/Auth/auth.service';

@Component({
  selector: 'app-transaction-list',
  standalone: false,
  templateUrl: './transaction-list.component.html',
  styleUrl: './transaction-list.component.css',
})
export class TransactionListComponent implements OnInit {
  //observable variables that store data from select.
  transactions$: Observable<Transaction[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  userId!: string;
  showForm: boolean = false;

  private store = inject(Store<TransactionState>);
  private authService = inject(AuthService);
  constructor() {
    this.transactions$ = this.store.select(selectTransactions);
    this.loading$ = this.store.select(selectLoading);
    this.error$ = this.store.select(selectError);
  }

  getUserId(): string {
    return this.authService.getUserId();
  }

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
  }

  deleteTransaction(transactionId: string | undefined): void {
    if (this.showForm) {
      alert('Please submit or close the existing form before proceeding.');
      return;
    }
    if (transactionId) {
      this.store.dispatch(
        deleteTransaction({
          payload: { userId: this.userId, transactionId: transactionId },
        })
      );
    }
  }
}
