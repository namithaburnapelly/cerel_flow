import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { TransactionState } from '../../@Ngrx/transaction.state';
import { AuthService } from '../Auth/auth.service';
import { Resolve } from '@angular/router';
import { loadTransactions } from '../../@Ngrx/transaction.actions';

@Injectable({
  providedIn: 'root',
})
export class TransactionResolve implements Resolve<void> {
  constructor(
    private store: Store<TransactionState>,
    private authService: AuthService
  ) {}
  resolve(): void {
    const userId = this.authService.getUserId();
    if (userId) {
      this.store.dispatch(loadTransactions({ payload: { userId } }));
    }
  }
}
