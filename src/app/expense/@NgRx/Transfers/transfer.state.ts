import { createFeatureSelector } from '@ngrx/store';
import { environmentVariables } from '../../../../environment/environment';
import { Transfer } from '../../Model/transfer.model';
import { ApiError } from '../Transactions/transaction.state';

export interface PaginationMetaData {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

//state interface for transfers
export interface TransferStore {
  transfers: Transfer[];
  pagination: PaginationMetaData;
  totalIncome: number;
  totalExpenses: number;
  sortOrder: string;
  //extra
  loading: boolean;
  error: ApiError | null;
}

//initial state for transfers
export const transferInitialState: TransferStore = {
  transfers: [],
  pagination: {
    currentPage: 1,
    pageSize: environmentVariables.transferPageSize ?? 10,
    totalItems: 0,
    totalPages: 0,
  },
  totalIncome: 0,
  totalExpenses: 0,
  sortOrder: 'date_desc',
  loading: false,
  error: null,
};

//selectors variables
const TRANSFER_FEATURE_KEY = environmentVariables.TRANSFER_FEATURE_KEY;

export const selectTransferStore =
  createFeatureSelector<TransferStore>(TRANSFER_FEATURE_KEY);
