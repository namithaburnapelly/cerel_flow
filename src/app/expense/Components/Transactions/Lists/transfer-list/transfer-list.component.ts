import { Component, inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Transfer } from '../../../../Model/transfer.model';
import {
  PaginationMetaData,
  TransferStore,
} from '../../../../@NgRx/Transfers/transfer.state';
import { AuthService } from '../../../../../Authentication/Service/auth.service';
import {
  selectErrorofTransfers,
  selectLoadingofTransfers,
  selectPaginationofTransfers,
  selectTransfers,
} from '../../../../@NgRx/Transfers/transfer.selectors';
import {
  deleteTransfer,
  loadTransfers,
} from '../../../../@NgRx/Transfers/transfer.actions';
import { UpdateTransferComponent } from '../../../Payments/@Angular_material/update-transfer/update-transfer.component';
import { ConfirmDeleteDialogComponent } from '../../../Payments/@Angular_material/confirm-delete-dialog/confirm-delete-dialog.component';
import { NotificationService } from '../../../../Service/Notification/notification.service';

@Component({
  selector: 'app-transfer-list',
  standalone: false,

  templateUrl: './transfer-list.component.html',
  styleUrl: './transfer-list.component.css',
})
export class TransferListComponent implements OnInit {
  transactions$: Observable<Transfer[]>;
  pagination$: Observable<PaginationMetaData>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  //date
  today = new Date();

  userId!: string;
  currentPage!: number;
  pageSize: number;
  selectedSortOrder: string = 'date_desc';

  private store = inject(Store<TransferStore>);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  //Angular material for dialog box to confirm delete
  private dialog = inject(MatDialog);
  private notificationService = inject(NotificationService);

  constructor() {
    this.transactions$ = this.store.select(selectTransfers);
    this.pagination$ = this.store.select(selectPaginationofTransfers);
    this.loading$ = this.store.select(selectLoadingofTransfers);
    this.error$ = this.store.select(selectErrorofTransfers);

    //get local storage items
    this.pageSize = Number(localStorage.getItem('transfers_per_page')) || 10;
  }

  ngOnInit(): void {
    this.userId = this.authService.getUserDetails('userId');

    this.route.queryParams.subscribe((params) => {
      const { page, pageSize } = params;
      this.currentPage = +page || 1;
      //only update when page size value is present , else use stored value
      this.pageSize = pageSize ? +pageSize : this.pageSize;

      if (this.userId) {
        this.loadTransfers();
      }
    });
  }

  loadTransfers() {
    this.store.dispatch(
      loadTransfers({
        payload: {
          userId: this.userId,
          page: this.currentPage,
          pageSize: this.pageSize,
          sortOrder: this.selectedSortOrder,
        },
      }),
    );
  }

  onSortChange(sortValue: string) {
    if (this.selectedSortOrder !== sortValue) {
      this.selectedSortOrder = sortValue;
      this.loadTransfers();
    }
  }

  onPageChange(page: number): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: page },
      queryParamsHandling: 'merge',
    });
  }

  transferForm() {
    localStorage.setItem('latestForm', 'Transfer');
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

    localStorage.setItem('transfers_per_page', this.pageSize.toString());
  }

  openUpdateModal(transaction: Transfer) {
    this.dialog.open(UpdateTransferComponent, {
      width: '500px',
      data: transaction,
    });
  }

  confirmDelete(transaction: Transfer) {
    if (transaction) {
      const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
        width: '400px',
        data: { item_type: 'transfer', item_name: transaction.recipient },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result && transaction.transaction_id) {
          this.store.dispatch(
            deleteTransfer({
              payload: {
                userId: this.userId,
                transaction_id: transaction.transaction_id,
              },
            }),
          );
          this.notificationService.showNotification(
            'Transaction deleted successfully!',
          );

          //wait for store to update then fetch new data
          setTimeout(() => {
            this.transactions$.subscribe((trnx) => {
              if (trnx.length === 0) {
                this.goToPreviousPage();
              }
            });

            this.loadTransfers();
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
