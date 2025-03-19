import { createFeatureSelector } from '@ngrx/store';
import { PaginationMetaData } from '../Transfers/transfer.state';
import { environmentVariables } from '../../../../environment/environment';
import { Transaction } from '../../Model/transaction.model';

//state interface frr transactions
export interface TransactionState {
  transactions: Transaction[];
  pagination: PaginationMetaData;
  totalIncome: number;
  totalExpenses: number;
  sortOrder: string;
  loading: boolean;
  error: ApiError | null;
}

//intial state for transactions
export const transactionInitialState: TransactionState = {
  transactions: [],
  pagination: {
    currentPage: 1,
    pageSize: environmentVariables.transactionPageSize,
    totalItems: 0,
    totalPages: 0,
  },
  totalIncome: 0,
  totalExpenses: 0,
  sortOrder: 'date_desc',
  loading: false,
  error: null,
};

export interface ApiError {
  message: string;
  errorCode?: string; //for debugging
}

const TRANSACTION_FEATURE_KEY = environmentVariables.TRANSACTION_FEATURE_KEY;

//the createFeatureSelector method returns a top level feature state.
//It reutrns a typed selector function for a feature slice of state.

//The below line gets the entire transactionState
export const selectTransactionState = createFeatureSelector<TransactionState>(
  TRANSACTION_FEATURE_KEY,
);
