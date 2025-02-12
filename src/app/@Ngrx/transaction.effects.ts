import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TransactionService } from '../Service/Transaction/transaction.service';
import {
  addTransaction,
  addTransactionError,
  addTransactionSuccess,
  loadTransactions,
  loadTransactionsError,
  loadTransactionsSuccess,
} from './transaction.actions';
import { of } from 'rxjs';
import { mergeMap, catchError, map, tap } from 'rxjs/operators';

@Injectable()
export class TransactionEffects {
  private actions$ = inject(Actions);

  constructor(private transactionService: TransactionService) {}
  //createEffect is a function from ngrx that listens to dispatched actions and perform side effects(API Calls).
  loadTransactions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadTransactions),
      mergeMap(({ payload }) =>
        this.transactionService.getTransactions(payload.userId).pipe(
          tap((transactions) =>
            console.log('loaded transactions from reducer are,', transactions)
          ),
          map((transactions) =>
            loadTransactionsSuccess({ payload: transactions })
          ),
          catchError(async (error) => loadTransactionsError({ payload: error }))
        )
      )
    )
  );

  addTransaction$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addTransaction),
      tap(({ payload }) =>
        console.log('🛠️ Effect received addTransaction:', payload)
      ),
      mergeMap(({ payload }) =>
        this.transactionService
          .addTransaction(payload.userId, payload.newTransaction)
          .pipe(
            tap((response) =>
              console.log('✅ Transaction successfully saved:', response)
            ),
            // map((newTransaction) =>
            //   //pass the new transaction rom the original action
            //   addTransactionSuccess({ payload: { newTransaction.newTransaction } })
            // ),
            map((response) => {
              const newTransaction = response.newTransaction; // ✅ Extract newTransaction from response

              console.log('🚀 Sending to Reducer:', newTransaction); // Debug log

              return addTransactionSuccess({ payload: { newTransaction } }); // ✅ Correct structure
            }),
            // catchError(async (error) => addTransactionError({ payload: error }))
            catchError((error) => {
              console.error('❌ Error in addTransaction effect:', error);
              return of(addTransactionError({ payload: error }));
            })
          )
      )
    )
  );
}
