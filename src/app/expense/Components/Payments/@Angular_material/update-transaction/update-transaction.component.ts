import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Transaction } from '../../../../Model/transaction.model';

@Component({
  selector: 'app-update-transaction',
  standalone: false,

  templateUrl: './update-transaction.component.html',
  styleUrl: './update-transaction.component.css',
})
export class UpdateTransactionComponent {
  constructor(
    public dialogRef: MatDialogRef<UpdateTransactionComponent>,
    @Inject(MAT_DIALOG_DATA) public transaction: Transaction,
  ) {}

  close() {
    this.dialogRef.close();
  }
}
