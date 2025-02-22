import { createSelector } from '@ngrx/store';
import { selectTransactionState } from './transaction.state';

//Selectors: pure funcitons used for obtaining slices of the store state.

//createSelector is am NgRx function that creates a memonized selector.
//It helps optimize performance by caching the result and only recomputing when input state changes.

//selectors to extract specific properties.
//To get all transactions
export const selectTransactions = createSelector(
  selectTransactionState,
  (state) => state.transactions
);

//selector for pagination meta data
export const selectPagination = createSelector(
  selectTransactionState,
  (state) => state.pagination
);

//check if loading is true
export const selectLoading = createSelector(
  selectTransactionState,
  (state) => state.loading
);

//error message if any
export const selectError = createSelector(selectTransactionState, (state) =>
  state.error ? state.error.message : null
);

//select transactions by category
export const selectTransactionByCategory = (category: string) =>
  createSelector(selectTransactions, (transactions) =>
    transactions.filter((txn) => txn.category === category)
  );

//select total income
export const selectTotalIncome = createSelector(
  selectTransactions,
  (transactions) =>
    transactions
      .filter((txn) => txn.type === 'Income')
      .reduce((total, txn) => total + txn.amount, 0)
);

//select total expense
export const selectTotalExpenses = createSelector(
  selectTransactions,
  (transactions) =>
    transactions
      .filter((txn) => txn.type === 'Expense')
      .reduce((total, txn) => total + txn.amount, 0)
);

//select net balance
export const selectNetBalance = createSelector(
  selectTotalIncome,
  selectTotalExpenses,
  (totalIncome, totalExpenses) => totalIncome - totalExpenses
);
