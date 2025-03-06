import { createSelector } from '@ngrx/store';
import { selectTransferStore } from './transfer.state';

//to get paginated transactions of transfers
export const selectTransfers = createSelector(
  selectTransferStore,
  (state) => state.transfers
);

//pagination meta data
export const selectPaginationofTransfers = createSelector(
  selectTransferStore,
  (state) => state.pagination
);

//check if loading
export const selectLoadingofTransfers = createSelector(
  selectTransferStore,
  (state) => state.loading
);

//error if any
export const selectErrorofTransfers = createSelector(
  selectTransferStore,
  (state) => (state.error ? state.error.message : null)
);

//select totalIncome
export const selectIncomeofTransfers = createSelector(
  selectTransferStore,
  (state) => state.totalIncome
);

//select total expenses
export const selectExpensesofTransfers = createSelector(
  selectTransferStore,
  (state) => state.totalExpenses
);

//select sort order
export const selectSortOrderofTransfers = createSelector(
  selectTransferStore,
  (state) => state.sortOrder
);

//total new balance
export const selectNetBalanceofTransfers = createSelector(
  selectIncomeofTransfers,
  selectExpensesofTransfers,
  (totalIncome, totalExpenses) => totalIncome - totalExpenses
);
