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
  loadTransactions,
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

  selectedTransaction: Transaction | null = null; //holds the transaction to edit
  // selectedFile: File | null = null;

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

  toggleTransactionForm() {
    if (this.showForm) {
      alert('Please submit or close the existing form before proceeding.');
      return;
    }
    this.showForm = !this.showForm;
  }

  //checks if the form is being submitted for update or add then performs action
  handleFormSubmitted(data: Transaction): void {
    if (this.selectedTransaction?.transactionId) {
      //update the existing transaction
      this.store.dispatch(
        updateTransaction({
          payload: {
            userId: this.userId,
            transactionId: this.selectedTransaction.transactionId,
            changes: data,
          },
        })
      );
      this.selectedTransaction = null;
    } else {
      //Add a new transaction
      this.store.dispatch(
        addTransaction({
          payload: {
            userId: this.userId,
            newTransaction: data,
          },
        })
      );
    }
    this.showForm = false;
  }

  handleFormCancel() {
    this.showForm = false;
    this.selectedTransaction = null;
  }

  editTransaction(transaction: Transaction) {
    if (this.showForm) {
      alert('Please submit or close the existing form before proceeding.');
      return;
    }

    this.selectedTransaction = { ...transaction };
    this.showForm = true;
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
