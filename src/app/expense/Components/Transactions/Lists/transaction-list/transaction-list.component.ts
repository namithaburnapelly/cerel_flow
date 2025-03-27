import { Component, inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import {
  selectErrorofTransactions,
  selectLoadingofTransactions,
  selectPaginationofTransactions,
  selectTransactions,
} from '../../../../@NgRx/Transactions/transaction.selectors';
import {
  deleteTransaction,
  loadTransactions,
} from '../../../../@NgRx/Transactions/transaction.actions';
import { UpdateTransactionComponent } from '../../../Payments/@Angular_material/update-transaction/update-transaction.component';
import { ConfirmDeleteDialogComponent } from '../../../Payments/@Angular_material/confirm-delete-dialog/confirm-delete-dialog.component';
import { Transaction } from '../../../../Model/transaction.model';
import { PaginationMetaData } from '../../../../@NgRx/Transfers/transfer.state';
import { AuthService } from '../../../../../Authentication/Service/auth.service';
import { TransactionState } from '../../../../@NgRx/Transactions/transaction.state';
import { NotificationService } from '../../../../Service/Notification/notification.service';
import { CATEGORY_MAP } from '../../../../Model/category';

@Component({
  selector: 'app-transaction-list',
  standalone: false,
  templateUrl: './transaction-list.component.html',
  styleUrl: './transaction-list.component.css',
})
export class TransactionListComponent implements OnInit {
  //observable variables that store data from select.
  transactions$: Observable<Transaction[]>;
  pagination$: Observable<PaginationMetaData>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  //pagination parameters
  userId!: string;
  currentPage!: number;
  pageSize: number;
  selectedSortOrder: string = 'date_desc';

  //date
  today = new Date();

  private store = inject(Store<TransactionState>);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  //Angular material for dialog box to confirm delete
  private dialog = inject(MatDialog);
  private notificationService = inject(NotificationService);

  constructor() {
    this.transactions$ = this.store.select(selectTransactions);
    this.pagination$ = this.store.select(selectPaginationofTransactions);
    this.loading$ = this.store.select(selectLoadingofTransactions);
    this.error$ = this.store.select(selectErrorofTransactions);

    //get local storage items
    this.pageSize = Number(localStorage.getItem('transactions_per_page')) || 10;
  }

  ngOnInit(): void {
    this.userId = this.authService.getUserDetails('userId');
    //get the route and set params page to 1 by default or if exists to it
    this.route.queryParams.subscribe((params) => {
      const { page, pageSize } = params;
      this.currentPage = +page || 1;
      //only update when page size value is present , else use stored value
      this.pageSize = pageSize ? +pageSize : this.pageSize;
      //fetch transactions when the component initializes
      if (this.userId) {
        this.loadTransactions();
      }
    });
  }

  loadTransactions() {
    this.store.dispatch(
      loadTransactions({
        payload: {
          userId: this.userId,
          page: this.currentPage,
          pageSize: this.pageSize,
          sortOrder: this.selectedSortOrder,
        },
      }),
    );
  }

  onSortChange(event: any) {
    this.selectedSortOrder = event.target.value;
    this.loadTransactions();
  }

  onPageChange(page: number): void {
    //navigate to the page
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: page },
      queryParamsHandling: 'merge',
    });
  }

  onPageSizeChange(event: Event) {
    //+ is a shorthand convertion of string to number
    this.pageSize = +(event.target as HTMLSelectElement).value;
    this.currentPage = 1;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: this.currentPage, pageSize: this.pageSize },
      queryParamsHandling: 'merge',
    });
    localStorage.setItem('transactions_per_page', this.pageSize.toString());
  }

  getCategoryDetails(category: string) {
    return CATEGORY_MAP[category] || CATEGORY_MAP['Others'];
  }

  openUpdateModal(transaction: Transaction) {
    this.dialog.open(UpdateTransactionComponent, {
      width: '500px',
      data: transaction,
    });
  }

  confirmDelete(transaction: Transaction) {
    if (transaction) {
      const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
        width: '400px',
        data: { item_type: 'transaction', item_name: transaction.category },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result && transaction.transaction_id) {
          this.store.dispatch(
            deleteTransaction({
              payload: {
                userId: this.userId,
                transaction_id: transaction.transaction_id,
              },
            }),
          );

          this.notificationService.showNotification(
            'Transaction deleted successfully!',
          );

          //wait for the store to update then fetch new data
          setTimeout(() => {
            this.transactions$.subscribe((trnx) => {
              if (trnx.length === 0) {
                this.goToPreviousPage();
              }
            });
          }, 500);
        }
      });
    }
  }
  goToPreviousPage() {
    this.pagination$.subscribe((pagination) => {
      if (pagination.currentPage > 1) {
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { page: pagination.currentPage - 1 },
          queryParamsHandling: 'merge',
        });
      }
    });
  }
}
