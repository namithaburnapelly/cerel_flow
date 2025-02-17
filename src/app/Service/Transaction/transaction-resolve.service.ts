import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { TransactionState } from '../../@Ngrx/transaction.state';
import { AuthService } from '../Auth/auth.service';
import { Resolve } from '@angular/router';
import { loadTransactions } from '../../@Ngrx/transaction.actions';

@Injectable({
  providedIn: 'root',
})
export class TransactionResolve implements Resolve<void> {
  private store = inject(Store<TransactionState>);
  private authService = inject(AuthService);

  constructor() {}
  resolve(): void {
    const userId = this.authService.getUserId();
    if (userId) {
      this.store.dispatch(loadTransactions({ payload: { userId } }));
    }
  }
}
