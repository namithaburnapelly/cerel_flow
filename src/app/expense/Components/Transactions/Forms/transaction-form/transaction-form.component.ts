import { Component, inject, Input, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Store } from '@ngrx/store';
import { MatDialogRef } from '@angular/material/dialog';
import { Transaction } from '../../../../Model/transaction.model';
import { AuthService } from '../../../../../Authentication/Service/auth.service';
import { formatDate } from '../../../../utils/Today_date';
import {
  addTransaction,
  updateTransaction,
} from '../../../../@NgRx/Transactions/transaction.actions';
import { NotificationService } from '../../../../Service/Notification/notification.service';

@Component({
  selector: 'app-transaction-form',
  standalone: false,
  templateUrl: './transaction-form.component.html',
  styleUrl: './transaction-form.component.css',
})
export class TransactionFormComponent implements OnInit {
  //holds the transaction if editing
  @Input() transactionData!: Transaction;

  transactionForm: FormGroup;
  userId!: string;

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private store = inject(Store);
  private notificationService = inject(NotificationService);

  constructor(
    @Optional() private dialogRef?: MatDialogRef<TransactionFormComponent>
  ) {
    this.transactionForm = this.fb.group({
      type: ['', Validators.required],
      category: ['', Validators.required],
      amount: [, [Validators.required, Validators.min(1)]],
      date: [''],
      description: [''],
      screenshot: [null],
    });
  }

  ngOnInit(): void {
    this.userId = this.authService.getUserId();

    //if update then patch values to form
    if (this.transactionData) {
      const transactionDate = formatDate(this.transactionData.date);
      this.transactionForm.patchValue({
        ...this.transactionData,
        date: transactionDate,
      });
    } else {
      this.transactionForm.get('date')?.patchValue(formatDate(new Date()));
    }
  }

  onSubmit() {
    //check if form is invalid
    if (this.transactionForm.invalid) {
      alert('Invalid form submission');
      return;
    }

    const data = this.transactionForm.value;
    if (this.transactionData) {
      this.store.dispatch(
        updateTransaction({
          payload: {
            userId: this.userId,
            transaction_id: this.transactionData.transaction_id,
            changes: data,
          },
        })
      );
      this.dialogRef?.close();
      this.notificationService.showNotification(
        'Transaction updated successfully!'
      );
    } else {
      this.store.dispatch(
        addTransaction({
          payload: {
            userId: this.userId,
            newTransaction: data,
          },
        })
      );
      this.notificationService.showNotification(
        'Transaction added successfully!'
      );
      this.transactionForm.reset();
    }
  }
}
