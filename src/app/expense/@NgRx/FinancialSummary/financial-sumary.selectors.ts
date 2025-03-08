import { createSelector } from '@ngrx/store';
import {
  selectExpensesofTransactions,
  selectIncomeofTransactions,
} from '../Transactions/transaction.selectors';
import {
  selectExpensesofTransfers,
  selectIncomeofTransfers,
} from '../Transfers/transfer.selectors';

export const selectTotalIncome = createSelector(
  selectIncomeofTransfers,
  selectIncomeofTransactions,
  (traansferIncome, transactionIncome) => traansferIncome + transactionIncome
);

export const selectTotalExpenses = createSelector(
  selectExpensesofTransfers,
  selectExpensesofTransactions,
  (transferExpenses, transactionExpenses) =>
    transferExpenses + transactionExpenses
);

export const selectNetBalance = createSelector(
  selectTotalIncome,
  selectTotalExpenses,
  (income, expenses) => income - expenses
);
