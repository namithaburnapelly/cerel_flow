import { createFeatureSelector } from '@ngrx/store';
import { environment } from '../../environment/environment';
import { Transaction } from '../Model/transaction.model';

//state interface frr transactions
export interface TransactionState {
  transactions: Transaction[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
  loading: boolean;
  error: { message: string | null } | null;
}

//intial state for transactions
export const initialState: TransactionState = {
  transactions: [],
  pagination: {
    currentPage: environment.currentPage,
    pageSize: environment.pageSize,
    totalItems: 0,
    totalPages: 0,
  },
  loading: false,
  error: null,
};

export interface ApiError {
  message: string;
  errorCode?: string; //for debugging
}

const TRANSACTION_FEATURE_KEY = environment.TRANSACTION_FEATURE_KEY;

//the createFeatureSelector method returns a top level feature state.
//It reutrns a typed selector function for a feature slice of state.

//The below line gets the entire transactionState
export const selectTransactionState = createFeatureSelector<TransactionState>(
  TRANSACTION_FEATURE_KEY
);
