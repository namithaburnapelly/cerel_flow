import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TransactionService } from '../Service/Transaction/transaction.service';
import {
  addTransaction,
  addTransactionError,
  addTransactionSuccess,
  deleteTransaction,
  deleteTransactionError,
  deleteTransactionSuccess,
  loadTransactions,
  loadTransactionsError,
  loadTransactionsSuccess,
  updateTransaction,
  updateTransactionError,
  updateTransactionSuccess,
} from './transaction.actions';
import { mergeMap, catchError, map, tap, switchMap } from 'rxjs/operators';

@Injectable()
export class TransactionEffects {
  private actions$ = inject(Actions);
  private transactionService = inject(TransactionService);

  //Effects:They are powered side effect model for store. Effects use streams to provide new sources
  //of actions to reduce state based on external interactions such as netwrok request, web socket messages
  //and time based events.

  constructor() {}
  //createEffect is a function from ngrx that listens to dispatched actions and perform side effects(API Calls).
  loadTransactions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadTransactions),
      //switch map cancels the previous inner observable when new one arrives.
      switchMap((action) =>
        this.transactionService
          .getTransactions(
            action.payload.userId,
            action.payload.page,
            action.payload.pageSize
          )
          .pipe(
            map((response) =>
              loadTransactionsSuccess({
                payload: {
                  transactions: response.transactions,
                  pagination: {
                    currentPage: response.pagination.currentPage,
                    pageSize: response.pagination.pageSize,
                    totalItems: response.pagination.totalItems,
                    totalPages: response.pagination.totalPages,
                  },
                },
              })
            ),
            catchError(async (error) =>
              loadTransactionsError({ payload: error })
            )
          )
      )
    )
  );

  addTransaction$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addTransaction),
      mergeMap(({ payload }) =>
        this.transactionService
          .addTransaction(payload.userId, payload.newTransaction)
          .pipe(
            map((response) => {
              const newTransaction = response.newTransaction; //get the new transaction from the response
              return addTransactionSuccess({ payload: { newTransaction } });
            }),
            catchError(async (error) => addTransactionError({ payload: error }))
          )
      )
    )
  );

  updateTransaction$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateTransaction),
      mergeMap(({ payload }) =>
        this.transactionService
          .updateTransaction(
            payload.userId,
            payload.transactionId,
            payload.changes
          )
          .pipe(
            map(() =>
              updateTransactionSuccess({
                payload: {
                  transactionId: payload.transactionId,
                  changes: payload.changes,
                },
              })
            )
          )
      ),
      catchError(async (error) => updateTransactionError({ payload: error }))
    )
  );

  deleteTransaction$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteTransaction),
      mergeMap(({ payload }) =>
        this.transactionService
          .deleteTransaction(payload.userId, payload.transactionId)
          .pipe(
            map(() =>
              deleteTransactionSuccess({
                payload: { transactionId: payload.transactionId },
              })
            )
          )
      ),
      catchError(async (error) => deleteTransactionError({ payload: error }))
    )
  );
}
