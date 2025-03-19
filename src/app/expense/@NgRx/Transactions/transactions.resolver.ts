import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { loadTransactions } from './transaction.actions';
import { AuthService } from '../../../Authentication/Service/auth.service';

export const transactionsResolver: ResolveFn<void> = () => {
  const store = inject(Store);
  const authService = inject(AuthService);

  store.dispatch(
    loadTransactions({
      payload: {
        userId: authService.getUserId(),
        page: 1,
        sortOrder: 'date_desc',
      },
    }),
  );
};
