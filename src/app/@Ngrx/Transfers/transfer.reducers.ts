import { createReducer, on } from '@ngrx/store';
import { transferInitialState, TransferStore } from './transfer.state';
import {
  addTransfer,
  addTransferError,
  addTransferSuccess,
  deleteTransfer,
  deleteTransferError,
  deleteTransferSuccess,
  loadTransfers,
  loadTransfersError,
  loadTransfersSuccess,
  resetTransferStore,
  updateTransfer,
  updateTransferError,
  updateTransferSuccess,
} from './transfer.actions';

function handleStateChange(
  state: TransferStore,
  changes: Partial<TransferStore>
): TransferStore {
  return { ...state, ...changes };
}

//reducer function
export const transferReducer = createReducer(
  transferInitialState,

  //load transfers
  on(loadTransfers, (state, { payload }) => {
    console.log('reducer 🟡 Dispatching loadTransfer action');
    return handleStateChange(state, {
      loading: true,
      error: null,
      sortOrder: payload.sortOrder,
    });
  }),
  on(loadTransfersSuccess, (state, { payload }) => {
    console.log('reducer ✅ loadTransferSuccess action received', payload);
    return handleStateChange(state, {
      transfers: payload.transfers,
      pagination: payload.pagination,
      totalIncome: payload.totalIncome,
      totalExpenses: payload.totalExpenses,
      sortOrder: payload.sortOrder,
      loading: false,
      error: null,
    });
  }),
  on(loadTransfersError, (state, { payload }) => {
    console.error(
      'reducer ❌ loadTransferFailure action received',
      payload.error
    );
    return handleStateChange(state, {
      loading: false,
      error: { message: payload.error.message },
    });
  }),

  //add transfer transaction
  on(addTransfer, (state) => {
    console.log('reducer 🟡 Dispatching addTransfer action');
    return handleStateChange(state, { loading: true, error: null });
  }),
  on(addTransferSuccess, (state, { payload }) => {
    console.log('reducer ✅ addTransferSuccess action received', payload);
    return handleStateChange(state, {
      transfers: [...state.transfers, payload.newTransfer],
      loading: false,
      error: null,
    });
  }),
  on(addTransferError, (state, { payload }) => {
    console.error(
      'reducer ❌ addTransferFailure action received',
      payload.error
    );
    return handleStateChange(state, {
      loading: false,
      error: { message: payload.error.message },
    });
  }),

  //on updation of transfer transaction
  on(updateTransfer, (state) => {
    console.log('reducer 🟡 Dispatching updateTransfer action');
    return handleStateChange(state, { loading: true, error: null });
  }),
  on(updateTransferSuccess, (state, { payload }) => {
    console.log('reducer ✅ updateTransferSuccess action received', payload);
    return handleStateChange(state, {
      transfers: state.transfers.map((transaction) =>
        transaction.transactionId === payload.transactionId
          ? { ...transaction, ...payload.updatedTransaction }
          : transaction
      ),
      loading: false,
      error: null,
    });
  }),
  on(updateTransferError, (state, { payload }) => {
    console.error(
      'reducer ❌ updateTransferFailure action received',
      payload.error
    );
    return handleStateChange(state, {
      loading: false,
      error: { message: payload.error.message },
    });
  }),

  //delete transfer transaction
  on(deleteTransfer, (state) => {
    console.log('reducer 🟡 Dispatching deleteTransfer action');
    return handleStateChange(state, { loading: true, error: null });
  }),
  on(deleteTransferSuccess, (state, { payload }) => {
    console.log('reducer ✅ deleteTransferSuccess action received', payload);
    return handleStateChange(state, {
      transfers: state.transfers.filter(
        (transactions) => transactions.transactionId !== payload.transactionId
      ),
      loading: false,
      error: null,
    });
  }),
  on(deleteTransferError, (state, { payload }) => {
    console.error(
      'reducer ❌ deleteTransferFailure action received',
      payload.error
    );
    return handleStateChange(state, {
      loading: false,
      error: { message: payload.error.message },
    });
  }),

  //logout
  on(resetTransferStore, () => transferInitialState) //reset to the initial state of the store
);
