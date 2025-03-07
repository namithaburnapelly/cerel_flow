import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Optional,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { formatDate } from '../Global variables/Today_date';
import { AuthService } from '../Service/Auth/auth.service';
import { Transfer } from '../Model/transfer.model';
import { Store } from '@ngrx/store';
import {
  addTransfer,
  updateTransfer,
} from '../@Ngrx/Transfers/transfer.actions';
import { MatDialogRef } from '@angular/material/dialog';

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

  constructor(
    @Optional() private dialogRef?: MatDialogRef<TransferformComponent>
  ) {
    this.transferForm = this.fb.group({
      recipient: ['Namitha', Validators.required],
      amount: [1200, [Validators.required, Validators.min(1)]],
      type: ['from', Validators.required],
      date: [''],
      description: [''],
    });
  }

  ngOnInit(): void {
    this.userId = this.authService.getUserId();

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
        })
      );
      this.dialogRef?.close();
    } else {
      this.store.dispatch(
        addTransfer({
          payload: {
            userId: this.userId,
            newTransfer: data,
          },
        })
      );
    }
    // this.transferForm.reset();
  }
}
