import { ResolveFn } from '@angular/router';
import { loadTransfers } from './transfer.actions';
import { Store } from '@ngrx/store';
import { AuthService } from '../../../Authentication/Service/auth.service';
import { inject } from '@angular/core';

export const transfersResolver: ResolveFn<void> = () => {
  const store = inject(Store);
  const authService = inject(AuthService);

  store.dispatch(
    loadTransfers({
      payload: {
        userId: authService.getUserDetails('userId'),
        page: 1,
        sortOrder: 'date_desc',
      },
    }),
  );
};
