import { createReducer, on } from '@ngrx/store';
import { transactionInitialState, TransactionState } from './transaction.state';
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
  resetTransactionStore,
  updateTransaction,
  updateTransactionError,
  updateTransactionSuccess,
} from './transaction.actions';

//Reducers: They are responsible for handling transitions from one state to next state in the application.
//Reducer functions handle these transitions by determining which actions to handle based on action's type.
//They are pure functions, they produce same output for a given input. They handle each state synchronously.
//Each reducer function takes the latest action dispatched, the current state, and
// determines whether to reutrn a newly modified state or the original state.

//function to handle state updates
export function handleStateChange(
  state: TransactionState,
  changes: Partial<TransactionState>,
): TransactionState {
  return { ...state, ...changes };
}

//reducer function
export const transactionReducer = createReducer(
  transactionInitialState,

  //load transactions
  on(loadTransactions, (state, { payload }) => {
    // console.log('reducer 🟡 Dispatching loadTransaction action');
    return handleStateChange(state, {
      loading: true,
      error: null,
      sortOrder: payload.sortOrder,
    });
  }),
  on(loadTransactionsSuccess, (state, { payload }) => {
    // console.log('reducer ✅ loadTransactionSuccess action received', payload);
    return handleStateChange(state, {
      transactions: payload.transactions,
      pagination: payload.pagination,
      totalIncome: payload.totalIncome,
      totalExpenses: payload.totalExpenses,
      sortOrder: payload.sortOrder,
      loading: false,
      error: null,
    });
  }),
  on(loadTransactionsError, (state, { payload }) => {
    console.error(
      'reducer ❌ loadTransactionFailure action received',
      payload.error,
    );
    return handleStateChange(state, {
      loading: false,
      error: { message: payload.error.message },
    });
  }),

  //add transaction
  on(addTransaction, (state) => {
    // console.log('reducer 🟡 Dispatching addTransaction action');
    return handleStateChange(state, { loading: true, error: null });
  }),
  on(addTransactionSuccess, (state, { payload }) => {
    // console.log('reducer ✅ addTransactionSuccess action received', payload);
    return handleStateChange(state, {
      transactions: [...state.transactions, payload.newTransaction],
      loading: false,
      error: null,
    });
  }),
  on(addTransactionError, (state, { payload }) => {
    console.error(
      'reducer ❌ addTransactionFailure action received',
      payload.error,
    );
    return handleStateChange(state, {
      loading: false,
      error: { message: payload.error.message },
    });
  }),

  //update transaction
  on(updateTransaction, (state) => {
    // console.log('reducer 🟡 Dispatching updateTransaction action');
    return handleStateChange(state, { loading: true, error: null });
  }),
  on(updateTransactionSuccess, (state, { payload }) => {
    // console.log('reducer ✅ updateTransactionSuccess action received', payload);
    return handleStateChange(state, {
      transactions: state.transactions.map((transaction) =>
        transaction.transaction_id === payload.transaction_id
          ? { ...transaction, ...payload.updatedTransaction }
          : transaction,
      ),
      loading: false,
      error: null,
    });
  }),
  on(updateTransactionError, (state, { payload }) => {
    console.error(
      'reducer ❌ updateTransactionFailure action received',
      payload.error,
    );
    return handleStateChange(state, {
      loading: false,
      error: { message: payload.error.message },
    });
  }),

  //delete transaction
  on(deleteTransaction, (state) => {
    // console.log('reducer 🟡 Dispatching deleteTransaction action');
    return handleStateChange(state, { loading: true, error: null });
  }),
  on(deleteTransactionSuccess, (state, { payload }) => {
    // console.log('reducer ✅ deleteTransactionSuccess action received', payload);
    return handleStateChange(state, {
      transactions: state.transactions.filter(
        (transaction) => transaction.transaction_id !== payload.transaction_id,
      ),
      loading: false,
      error: null,
    });
  }),
  on(deleteTransactionError, (state, { payload }) => {
    console.error(
      'reducer ❌ updateTransactionFailure action received',
      payload.error,
    );
    return handleStateChange(state, {
      loading: false,
      error: { message: payload.error.message },
    });
  }),

  //logout
  on(resetTransactionStore, () => transactionInitialState), //reset to intitial state
);
