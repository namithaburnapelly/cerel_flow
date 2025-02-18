import { Component, inject, OnInit } from '@angular/core';
import { Transaction } from '../../Model/transaction.model';
import { Store } from '@ngrx/store';
import { addTransaction } from '../../@Ngrx/transaction.actions';
import { AuthService } from '../../Service/Auth/auth.service';

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
  }
  handleFormCancel() {
    this.showForm = false;
  }
}
