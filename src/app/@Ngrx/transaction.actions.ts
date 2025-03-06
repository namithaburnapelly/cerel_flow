import { createAction, props } from '@ngrx/store';
import { Transaction } from '../Model/transaction.model';
import { ApiError } from './transaction.state';

//Actions: Main building blocks in NgRx. Actions express unique events that happen throughout your application.
//Actions are input and output of many systems in NgRx. They help to understand how events are handled in the application.

//To load all the transactions
export const loadTransactions = createAction(
  '[Transaction] Load Transactions',
  props<{
    payload: {
      userId: string;
      page: number;
      pageSize: number;
    };
  }>()
);
//on success
export const loadTransactionsSuccess = createAction(
  '[Transaction] Load Transactions Success',
  props<{
    payload: {
      transactions: Transaction[]; //paginated transactions
      pagination: {
        currentPage: number;
        pageSize: number;
        totalItems: number;
        totalPages: number;
      };
    };
  }>()
);
//on failure
export const loadTransactionsError = createAction(
  '[Transaction] Load Transactions Error',
  props<{ payload: { error: ApiError } }>()
);

// to add transaction
export const addTransaction = createAction(
  '[Transaction] Add Transactions',
  props<{ payload: { userId: string; newTransaction: Transaction } }>()
);
//on success
export const addTransactionSuccess = createAction(
  '[Transaction] Add Transactions Success',
  props<{ payload: { newTransaction: Transaction } }>()
);
//on failure
export const addTransactionError = createAction(
  '[Transaction] Add Transactions Error',
  props<{ payload: { error: ApiError } }>()
);

//update transaction
export const updateTransaction = createAction(
  '[Transaction] Update Transactions',
  props<{
    payload: {
      userId: string;
      transactionId: string;
      changes: Partial<Transaction>;
    };
  }>()
);
//on success
export const updateTransactionSuccess = createAction(
  '[Transaction] Update Transactions Success',
  props<{ payload: { transactionId: string; changes: Partial<Transaction> } }>()
);
//on failure
export const updateTransactionError = createAction(
  '[Transaction] Update Transactions Error',
  props<{ payload: { error: ApiError } }>()
);

//delete Transaction
export const deleteTransaction = createAction(
  '[Transaction] Delete Transactions',
  props<{ payload: { userId: string; transactionId: string } }>()
);
//on success
export const deleteTransactionSuccess = createAction(
  '[Transaction] Delete Transactions Success',
  props<{ payload: { transactionId: string } }>()
);
//on failure
export const deleteTransactionError = createAction(
  '[Transaction] Delete Transactions Error',
  props<{ payload: { error: ApiError } }>()
);

//when user logs out reset the store
export const resetTransactionState = createAction('[Transaction] Reset State');
