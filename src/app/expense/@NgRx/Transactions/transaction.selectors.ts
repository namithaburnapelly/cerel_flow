import { createSelector } from '@ngrx/store';
import { selectTransactionState } from './transaction.state';

//Selectors: pure funcitons used for obtaining slices of the store state.

//createSelector is am NgRx function that creates a memonized selector.
//It helps optimize performance by caching the result and only recomputing when input state changes.

//selectors to extract specific properties.
//to get paginated transactions
export const selectTransactions = createSelector(
  selectTransactionState,
  (state) => state.transactions,
);

//selector for pagination meta data
export const selectPaginationofTransactions = createSelector(
  selectTransactionState,
  (state) => state.pagination,
);

//check if loading is true
export const selectLoadingofTransactions = createSelector(
  selectTransactionState,
  (state) => state.loading,
);

//error message if any
export const selectErrorofTransactions = createSelector(
  selectTransactionState,
  (state) => (state.error ? state.error.message : null),
);

//select totalIncome
export const selectIncomeofTransactions = createSelector(
  selectTransactionState,
  (state) => state.totalIncome,
);

//select total expenses
export const selectExpensesofTransactions = createSelector(
  selectTransactionState,
  (state) => state.totalExpenses,
);

//total new balance
export const selectNetBalanceofTransactions = createSelector(
  selectIncomeofTransactions,
  selectExpensesofTransactions,
  (totalIncome, totalExpenses) => totalIncome - totalExpenses,
);
