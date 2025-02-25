import { Component, inject, OnInit } from '@angular/core';
import { Transaction } from '../../Model/transaction.model';
import { Store } from '@ngrx/store';
import { addTransaction } from '../../@Ngrx/transaction.actions';
import { AuthService } from '../../Service/Auth/auth.service';
import { Router } from '@angular/router';
import { TransactionService } from '../../Service/Transaction/transaction.service';
import { environment } from '../../../environment/environment';

@Component({
  selector: 'app-new-transaction',
  standalone: false,

  templateUrl: './new-transaction.component.html',
  styleUrl: './new-transaction.component.css',
})
export class NewTransactionComponent implements OnInit {
  userId!: string;
  showForm: boolean = false;

  private store = inject(Store);
  private authService = inject(AuthService);
  private transactionService = inject(TransactionService);
  private router = inject(Router);

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

  handleFormSubmitted(data: Transaction): void {
    //Add a new transaction
    this.store.dispatch(
      addTransaction({
        payload: {
          userId: this.userId,
          newTransaction: data,
        },
      })
    );

    this.showForm = false;

    //navigate to transaction page 1 upon adding the transaction
    this.router.navigate(['/private/transaction/list'], {
      queryParams: { page: 1 },
      queryParamsHandling: 'merge',
    });

    //load the transactions
    this.transactionService.loadTransactions(
      this.userId,
      1,
      environment.pageSize
    );
  }

  handleFormCancel() {
    this.showForm = false;
  }
}
