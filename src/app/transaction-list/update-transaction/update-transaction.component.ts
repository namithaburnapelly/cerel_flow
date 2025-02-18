import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { Transaction } from '../../Model/transaction.model';
import { updateTransaction } from '../../@Ngrx/transaction.actions';
import { Store } from '@ngrx/store';
import { AuthService } from '../../Service/Auth/auth.service';

@Component({
  selector: 'app-update-transaction',
  standalone: false,

  templateUrl: './update-transaction.component.html',
  styleUrl: './update-transaction.component.css',
})
export class UpdateTransactionComponent implements OnInit {
  //holds the transaction to edit
  @Input() transactionToEdit: Transaction | null = null;

  userId!: string;
  showForm: boolean = false;

  private store = inject(Store);
  private authService = inject(AuthService);

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
  }

  showTransactionForm(): void {}

  editTransaction() {
    if (this.showForm) {
      alert('Please submit or close the existing form before proceeding.');
      return;
    }
    this.showForm = true;
  }
  handleFormSubmitted(data: Transaction): void {
    if (this.transactionToEdit?.transactionId) {
      this.store.dispatch(
        updateTransaction({
          payload: {
            userId: this.userId,
            transactionId: this.transactionToEdit.transactionId,
            changes: data,
          },
        })
      );
      this.transactionToEdit = null;
    }
    this.showForm = false;
  }

  handleFormCancel() {
    this.showForm = false;
    this.transactionToEdit = null;
  }
}
