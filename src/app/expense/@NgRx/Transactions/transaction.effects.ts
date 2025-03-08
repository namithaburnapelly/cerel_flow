import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
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
import { mergeMap, catchError, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { TransactionService } from '../../Service/Transaction/transaction.service';

@Injectable()
export class TransactionEffects {
  private actions$ = inject(Actions);
  private transactionService = inject(TransactionService);

  //Effects:They are powered side effect model for store. Effects use streams to provide new sources
  //of actions to reduce state based on external interactions such as netwrok request, web socket messages
  //and time based events.

  //createEffect is a function from ngrx that listens to dispatched actions and perform side effects(API Calls).
  loadTransactions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadTransactions),
      tap((action) => console.log('🔹 Action Dispatched:', action)), // Logs action
      //switch map cancels the previous inner observable when new one arrives.
      switchMap((action) =>
        this.transactionService
          .getTransactions(
            action.payload.userId,
            action.payload.page,
            action.payload.pageSize || 5,
            action.payload.sortOrder
          )
          .pipe(
            tap((response) => console.log('✅ API Response:', response)), // Logs successful API response
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
                  totalIncome: response.totalIncome,
                  totalExpenses: response.totalExpenses,
                  sortOrder: response.sortOrder,
                },
              })
            ),
            tap(() => console.log('✅ Dispatching Success Action')), // Logs before success action is dispatched
            catchError((error) => {
              console.error('❌ API Error:', error); // Logs error response
              return of(
                loadTransactionsError({
                  payload: error,
                })
              );
            })
          )
      )
    )
  );

  addTransaction$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addTransaction),
      tap((action) => console.log('🔹 Action Dispatched:', action)),
      mergeMap(({ payload }) =>
        this.transactionService
          .addTransaction(payload.userId, payload.newTransaction)
          .pipe(
            tap((response) => console.log('✅ API Response:', response)),
            map((response) =>
              addTransactionSuccess({
                payload: {
                  userId: payload.userId,
                  newTransaction: payload.newTransaction,
                },
              })
            ),
            tap(() => console.log('✅ Dispatching Success Action')),
            catchError((error) => {
              console.error('❌ API Error:', error); // Logs error response
              return of(
                addTransactionError({
                  payload: error,
                })
              );
            })
          )
      )
    )
  );

  updateTransaction$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateTransaction),
      tap((action) => console.log('🔹 Action Dispatched:', action)),
      mergeMap(({ payload }) =>
        this.transactionService
          .updateTransaction(
            payload.userId,
            payload.transaction_id,
            payload.changes
          )
          .pipe(
            tap(() => console.log('✅ Transfer updated Successfully')),
            map(() =>
              updateTransactionSuccess({
                payload: {
                  userId: payload.userId,
                  transaction_id: payload.transaction_id,
                  updatedTransaction: payload.changes,
                },
              })
            ),
            tap(() => console.log('✅ Dispatching Success Action')),
            catchError((error) => {
              console.error('❌ API Error:', error);
              return of(
                updateTransactionError({
                  payload: error,
                })
              );
            })
          )
      )
    )
  );

  deleteTransaction$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteTransaction),
      tap((action) => console.log('🔹 Action Dispatched:', action)),
      mergeMap(({ payload }) =>
        this.transactionService
          .deleteTransaction(payload.userId, payload.transaction_id)
          .pipe(
            tap(() => console.log('✅ Transfer Deleted Successfully')),
            map(() =>
              deleteTransactionSuccess({
                payload: {
                  userId: payload.userId,
                  transaction_id: payload.transaction_id,
                },
              })
            ),
            catchError((error) => {
              console.error('❌ API Error:', error);
              return of(
                deleteTransactionError({
                  payload: error,
                })
              );
            })
          )
      )
    )
  );
}
