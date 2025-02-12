import { createReducer, on } from '@ngrx/store';
import { initialState, TransactionState } from './transaction.state';
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

//Reducers: They are responsible for handling transitions from one state to next state in the application.
//Reducer functions handle these transitions by determining which actions to handle based on action's type.
//They are pure functions, they produce same output for a given input. They handle each state synchronously.
//Each reducer function takes the latest action dispatched, the current state, and
// determines whether to reutrn a newly modified state or the original state.

//function to handle state updates
export function handleStateChange(
  state: TransactionState,
  changes: Partial<TransactionState>
): TransactionState {
  return { ...state, ...changes };
}

//reducer function
export const transactionReducer = createReducer(
  initialState,

  //load transactions
  on(loadTransactions, (state) => {
    console.log('load came here');
    return handleStateChange(state, { loading: true, error: null });
  }),
  on(loadTransactionsSuccess, (state, { payload }) => {
    console.log('Transactions Loaded:', payload.transactions); // Debug log
    return handleStateChange(state, {
      transactions: payload.transactions,
      loading: false,
    });
  }),
  on(loadTransactionsError, (state, { payload }) => {
    console.log('error in load');
    return handleStateChange(state, {
      loading: false,
      error: { message: payload.error.message },
    });
  }),

  //add transaction
  on(addTransaction, (state) => {
    console.log('came here');
    return handleStateChange(state, { loading: true, error: null });
  }),
  on(addTransactionSuccess, (state, { payload }) => {
    console.log('🟢 Reducer - Adding Transaction:', payload.newTransaction);
    return handleStateChange(state, {
      transactions: [...state.transactions, payload.newTransaction],
      loading: false,
    });
  }),
  on(addTransactionError, (state, { payload }) => {
    console.log('error came here');
    return handleStateChange(state, {
      loading: false,
      error: { message: payload.error.message },
    });
  }),

  //update transaction
  on(updateTransaction, (state) =>
    handleStateChange(state, { loading: true, error: null })
  ),
  on(updateTransactionSuccess, (state, { payload }) =>
    handleStateChange(state, {
      transactions: state.transactions.map((transaction) =>
        transaction.transactionId === payload.transactionId
          ? { ...transaction, ...payload.changes }
          : transaction
      ),
      loading: false,
    })
  ),
  on(updateTransactionError, (state, { payload }) =>
    handleStateChange(state, {
      loading: false,
      error: { message: payload.error.message },
    })
  ),

  //delete transaction
  on(deleteTransaction, (state) =>
    handleStateChange(state, { loading: true, error: null })
  ),
  on(deleteTransactionSuccess, (state, { payload }) =>
    handleStateChange(state, {
      transactions: state.transactions.filter(
        (transaction) => transaction.transactionId !== payload.transactionId
      ),
      loading: false,
    })
  ),
  on(deleteTransactionError, (state, { payload }) =>
    handleStateChange(state, {
      loading: false,
      error: { message: payload.error.message },
    })
  )
);
