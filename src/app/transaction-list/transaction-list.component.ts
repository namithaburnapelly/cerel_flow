import { Component, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Transaction } from '../Model/transaction.model';
import { Store } from '@ngrx/store';
import {
  selectError,
  selectLoading,
  selectTransactions,
} from '../@Ngrx/transaction.selectors';
import {
  addTransaction,
  addTransactionSuccess,
  deleteTransaction,
  deleteTransactionSuccess,
  loadTransactions,
  loadTransactionsSuccess,
} from '../@Ngrx/transaction.actions';
import { TransactionState } from '../@Ngrx/transaction.state';
import { AuthService } from '../Service/Auth/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-transaction-list',
  standalone: false,

  templateUrl: './transaction-list.component.html',
  styleUrl: './transaction-list.component.css',
})
export class TransactionListComponent implements OnInit {
  transactions$: Observable<Transaction[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  userId!: string;
  /////////////////////////////
  transactionForm: FormGroup;
  selectedFile: File | null = null;
  ///////////////////////////////////
  constructor(
    private store: Store<TransactionState>,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.transactions$ = this.store.select(selectTransactions);
    this.loading$ = this.store.select(selectLoading);
    this.error$ = this.store.select(selectError);

    /////////////////////////////
    this.transactionForm = this.fb.group({
      type: ['Income', Validators.required], // ✅ Default value: Income
      category: ['Salary', Validators.required], // ✅ Default value: Salary
      amount: [100, [Validators.required, Validators.min(1)]], // ✅ Default value: 100
      description: ['Monthly Salary'], // ✅ Default value: Monthly Salary
      // wallet: ['Main Wallet'], // ✅ Default value: Main Wallet
      // screenshot: [null],
    });
  }

  getUserId(): string {
    return this.authService.getUserId();
  }

  ngOnInit(): void {
    this.userId = this.getUserId();

    if (this.userId) {
      this.store.dispatch(
        loadTransactions({ payload: { userId: this.userId } })
      );
    } else {
      console.error('Error Occured. Please try again later.');
    }
    ///////////////////////
    this.store.select(selectTransactions).subscribe((tsncx) => {
      console.log('tansc received', tsncx);
    });
  }

  onSubmitTransaction(): void {
    if (this.transactionForm.valid) {
      const formValues = this.transactionForm.value;
      const newTransaction: Transaction = {
        userId: this.userId, // Replace with actual userId
        date: new Date(),
        type: formValues.type,
        category: formValues.category,
        amount: formValues.amount,
        description: formValues.description,
        // wallet: formValues.wallet,
        // screenshot: this.selectedFile || undefined,
      };

      console.log('🚀 Dispatching addTransaction:', newTransaction);

      this.store.dispatch(
        addTransaction({
          payload: { userId: this.userId, newTransaction: newTransaction },
        })
      );
      this.transactionForm.reset({
        type: 'Income',
        category: 'Salary',
        amount: 100,
        description: 'Monthly Salary',
        wallet: 'Main Wallet',
      });
    }
  }
  // onSubmitTransaction() {
  //   const newTransaction: Transaction = {
  //     type: 'Income',
  //     amount: 200,
  //     category: 'Me',
  //     // transactionId: 'tx123',
  //     userId: this.getUserId(), // Get userId correctly
  //     date: new Date(), // Set current date
  //   };

  //   this.addTxn(newTransaction);
  // }

  // deleteTxn(transactionId: string): void {
  //   this.store.dispatch(
  //     deleteTransaction({ payload: { transactionId: transactionId } })
  //   );
  // }

  ///////////////////////////////////////////////

  // // Function to add a new transaction
  // addTxn(transaction: Transaction) {
  //   this.store.dispatch(addTransaction({ payload: { transaction } }));

  //   // Simulate successful addition
  //   setTimeout(() => {
  //     // Manually adding the transaction to the store
  //     this.store.dispatch(addTransactionSuccess({ payload: { transaction } }));
  //   }, 1000);
  // }

  // // Function to delete a transaction
  // deleteTxn(transactionId: string) {
  //   this.store.dispatch(deleteTransaction({ payload: { transactionId } }));

  //   // Simulate successful deletion
  //   setTimeout(() => {
  //     // Manually removing the transaction from the store
  //     this.store.dispatch(
  //       deleteTransactionSuccess({ payload: { transactionId } })
  //     );
  //   }, 1000);
  // }
}
