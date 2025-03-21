import { Component, inject, Input, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { MatDialogRef } from '@angular/material/dialog';
import { Transfer } from '../../../../Model/transfer.model';
import { AuthService } from '../../../../../Authentication/Service/auth.service';
import { formatDate } from '../../../../utils/Today_date';
import {
  addTransfer,
  updateTransfer,
} from '../../../../@NgRx/Transfers/transfer.actions';
import { NotificationService } from '../../../../Service/Notification/notification.service';

@Component({
  selector: 'app-transferform',
  standalone: false,

  templateUrl: './transferform.component.html',
  styleUrl: './transferform.component.css',
})
export class TransferformComponent implements OnInit {
  @Input() transactionData!: Transfer; //transaction for update

  transferForm: FormGroup;
  userId!: string;

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private store = inject(Store);
  private notificationService = inject(NotificationService);

  constructor(
    @Optional() private dialogRef?: MatDialogRef<TransferformComponent>,
  ) {
    this.transferForm = this.fb.group({
      recipient: ['', Validators.required],
      amount: [, [Validators.required, Validators.min(1)]],
      type: ['', Validators.required],
      date: [''],
      description: [''],
    });
  }

  ngOnInit(): void {
    this.userId = this.authService.getUserDetails('userId');

    //if update then patch values to form
    if (this.transactionData) {
      const transactionDate = formatDate(this.transactionData.date);
      this.transferForm.patchValue({
        ...this.transactionData,
        date: transactionDate,
      });
    } else {
      this.transferForm.get('date')?.patchValue(formatDate(new Date()));
    }
  }

  onSubmit(): void {
    //check if form is invalid
    if (this.transferForm.invalid) {
      alert('Invalid form submission');
      return;
    }

    const data = this.transferForm.value;
    if (this.transactionData) {
      this.store.dispatch(
        updateTransfer({
          payload: {
            userId: this.userId,
            transaction_id: this.transactionData.transaction_id,
            changes: data,
          },
        }),
      );
      this.dialogRef?.close();
      this.notificationService.showNotification(
        'Transaction updated Sucessfully!',
      );
    } else {
      this.store.dispatch(
        addTransfer({
          payload: {
            userId: this.userId,
            newTransfer: data,
          },
        }),
      );
      this.notificationService.showNotification(
        'Transaction Added Sucessfully!',
      );
    }
    this.transferForm.reset();
  }
}

/////changes: after form submitted give a notification and reset the form
