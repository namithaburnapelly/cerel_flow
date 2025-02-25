import { Component, inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Transaction } from '../Model/transaction.model';
import { Store } from '@ngrx/store';
import {
  selectError,
  selectLoading,
  selectPagination,
  selectTransactions,
} from '../@Ngrx/transaction.selectors';
import {
  deleteTransaction,
  updateTransaction,
} from '../@Ngrx/transaction.actions';
import { TransactionState } from '../@Ngrx/transaction.state';
import { AuthService } from '../Service/Auth/auth.service';
import { TransactionService } from '../Service/Transaction/transaction.service';
import { environment } from '../../environment/environment';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-transaction-list',
  standalone: false,
  templateUrl: './transaction-list.component.html',
  styleUrl: './transaction-list.component.css',
})
export class TransactionListComponent implements OnInit {
  //observable variables that store data from select.
  transactions$: Observable<Transaction[]>;
  pagination$: Observable<{
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  }>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  //pagination parameters
  userId!: string;
  currentPage!: number;
  pageSize = environment.pageSize;

  showForm: boolean = false;
  selectedTransaction: Transaction | null = null; //holds the transaction to edit
  // selectedFile: File | null = null;

  private store = inject(Store<TransactionState>);
  private authService = inject(AuthService);
  private transactionService = inject(TransactionService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  constructor() {
    this.transactions$ = this.store.select(selectTransactions);
    this.pagination$ = this.store.select(selectPagination);
    this.loading$ = this.store.select(selectLoading);
    this.error$ = this.store.select(selectError);
  }

  ngOnInit(): void {
    this.userId = this.authService.getUserId();

    //get the route and set params page to 1 by default or if exists to it
    this.route.queryParams.subscribe((params) => {
      this.currentPage = +params['page'] || 1;
      //fetch transactions when the component initializes
      this.transactionService.loadTransactions(
        this.userId,
        this.currentPage,
        this.pageSize
      );
    });
  }

  onPageChange(page: number): void {
    //navigate to the page
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: page },
      queryParamsHandling: 'merge',
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
      //Reset the selected transaction
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

      console.log('deleted transaction');
      // Reload the current page to fetch updated transactions
      this.transactionService.loadTransactions(
        this.userId,
        this.currentPage,
        this.pageSize
      );

      //for redirect to previous page if transactions are not available
      this.store.select(selectTransactions).subscribe((transactions) => {
        if (transactions.length === 0 && this.currentPage > 1) {
          this.currentPage--;
          console.log(this.currentPage);

          this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { page: this.currentPage },
            queryParamsHandling: 'merge',
          });

          this.transactionService.loadTransactions(
            this.userId,
            this.currentPage,
            this.pageSize
          );
        }
      });
    }
  }
}
