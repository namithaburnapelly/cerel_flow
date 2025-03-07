import { createAction, props } from '@ngrx/store';
import { ApiError } from './transaction.state';
import { Transaction } from '../../Model/transaction.model';

//Actions: Main building blocks in NgRx. Actions express unique events that happen throughout your application.
//Actions are input and output of many systems in NgRx. They help to understand how events are handled in the application.

//To load all the transactions
export const loadTransactions = createAction(
  '[Transaction] Load Transactions',
  props<{
    payload: {
      userId: string;
      page: number;
      pageSize?: number;
      sortOrder: string;
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
      totalIncome: number;
      totalExpenses: number;
      sortOrder: string;
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
  '[Transaction] Add Transaction',
  props<{ payload: { userId: string; newTransaction: Transaction } }>()
);
//on success
export const addTransactionSuccess = createAction(
  '[Transaction] Add Transaction Success',
  props<{ payload: { userId: string; newTransaction: Transaction } }>()
);
//on failure
export const addTransactionError = createAction(
  '[Transaction] Add Transaction Error',
  props<{ payload: { error: ApiError } }>()
);

//update transaction
export const updateTransaction = createAction(
  '[Transaction] Update Transaction',
  props<{
    payload: {
      userId: string;
      transaction_id: string;
      changes: Transaction;
    };
  }>()
);
//on success
export const updateTransactionSuccess = createAction(
  '[Transaction] Update Transaction Success',
  props<{
    payload: {
      userId: string;
      transaction_id: string;
      updatedTransaction: Transaction;
    };
  }>()
);
//on failure
export const updateTransactionError = createAction(
  '[Transaction] Update Transaction Error',
  props<{ payload: { error: ApiError } }>()
);

//delete Transaction
export const deleteTransaction = createAction(
  '[Transaction] Delete Transaction',
  props<{ payload: { userId: string; transaction_id: string } }>()
);
//on success
export const deleteTransactionSuccess = createAction(
  '[Transaction] Delete Transaction Success',
  props<{ payload: { userId: string; transaction_id: string } }>()
);
//on failure
export const deleteTransactionError = createAction(
  '[Transaction] Delete Transactions Error',
  props<{ payload: { error: ApiError } }>()
);

//when user logs out reset the store
export const resetTransactionStore = createAction('[Transaction] Reset State');
