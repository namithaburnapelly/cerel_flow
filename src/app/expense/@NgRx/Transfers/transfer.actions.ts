import { createAction, props } from '@ngrx/store';
import { Transfer } from '../../Model/transfer.model';
import { ApiError } from '../Transactions/transaction.state';

//To load paginated transfers
export const loadTransfers = createAction(
  '[Transfer] load Transfers',
  props<{
    payload: {
      userId: string;
      page: number;
      pageSize?: number; //can set default in effect
      sortOrder: string;
    };
  }>(),
);
//on success
export const loadTransfersSuccess = createAction(
  '[Transfer] load Transfers Success',
  props<{
    payload: {
      transfers: Transfer[]; //paginated transctions
      pagination: {
        currentPage: number;
        pageSize: number;
        totalItems: number;
        totalPages: number;
      };
      totalIncome: number;
      totalExpenses: number;
      sortOrder: string;
    };
  }>(),
);
//on Error
export const loadTransfersError = createAction(
  '[Transfer] load Transfers Error',
  props<{ payload: { error: ApiError } }>(),
);

//to add new transfer
export const addTransfer = createAction(
  '[Transfer] Add Transfer',
  props<{ payload: { userId: string; newTransfer: Transfer } }>(),
);
//on success
export const addTransferSuccess = createAction(
  '[Transfer] Add Transfer Success',
  props<{ payload: { userId: string; newTransfer: Transfer } }>(),
);
//on Error
export const addTransferError = createAction(
  '[Transfer] Add Transfer Error',
  props<{ payload: { error: ApiError } }>(),
);

//to update transfer
export const updateTransfer = createAction(
  '[Transfer] Update Transfer',
  props<{
    payload: {
      userId: string;
      transaction_id: string;
      changes: Transfer;
    };
  }>(),
);
//on success
export const updateTransferSuccess = createAction(
  '[Transfer] Update Transfer Success',
  props<{
    payload: {
      userId: string;
      transaction_id: string;
      updatedTransaction: Transfer;
    };
  }>(),
);
//on Error
export const updateTransferError = createAction(
  '[Transfer] Update Transfer Error',
  props<{ payload: { error: ApiError } }>(),
);

//delete transfer
export const deleteTransfer = createAction(
  '[Transfer] Delete Transfer',
  props<{ payload: { userId: string; transaction_id: string } }>(),
);
//on success
export const deleteTransferSuccess = createAction(
  '[Transfer] Delete Transfer Success',
  props<{ payload: { userId: string; transaction_id: string } }>(),
);
//on Error
export const deleteTransferError = createAction(
  '[Transfer] Delete Transfer Error',
  props<{ payload: { error: ApiError } }>(),
);

//when user logs out resest store
export const resetTransferStore = createAction('[Transfer] Reset Store');
