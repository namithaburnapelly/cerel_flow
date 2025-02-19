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

  //defines the page number
  p: number = 1;
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

  ngOnInit(): void {
    this.userId = this.authService.getUserId();

    //this sets all the transactions
    this.transactions$.subscribe((transactions) => {
      //handles pagination dynamically if the number of items changes
      const totalPages = Math.ceil(transactions.length / 5);
      if (this.p > totalPages) {
        this.p = totalPages || 1;
      }
    });
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
