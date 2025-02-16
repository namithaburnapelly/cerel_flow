import { createFeatureSelector } from '@ngrx/store';
import { environment } from '../../environment/environment';
import { Transaction } from '../Model/transaction.model';

//state interface frr transactions
export interface TransactionState {
  transactions: Transaction[];
  loading: boolean;
  error: { message: string | null } | null;
}

//intial state for transactions
export const initialState: TransactionState = {
  transactions: [],
  loading: false,
  error: null,
};

export interface ApiError {
  message: string;
}

const TRANSACTION_FEATURE_KEY = environment.TRANSACTION_FEATURE_KEY;

//the createFeatureSelector method returns a top level feature state.
//It reutrns a typed selector function for a feature slice of state.

//The below line gets the entire transactionState
export const selectTransactionState = createFeatureSelector<TransactionState>(
  TRANSACTION_FEATURE_KEY
);
