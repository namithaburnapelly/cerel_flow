import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TransferService } from '../../Service/Transfer/transfer.service';
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
  updateTransfer,
  updateTransferError,
  updateTransferSuccess,
} from './transfer.actions';
import { catchError, map, mergeMap, of, switchMap, tap } from 'rxjs';

@Injectable()
export class TransferEffects {
  private actions$ = inject(Actions);
  private transferService = inject(TransferService);

  loadTransfers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadTransfers),
      // tap((action) => console.log('🔹 Action Dispatched:', action)), // Logs action
      switchMap((action) =>
        this.transferService
          .getTransfers(
            action.payload.userId,
            action.payload.page,
            action.payload.pageSize || 10,
            action.payload.sortOrder,
          )
          .pipe(
            // tap((response) => console.log('✅ API Response:', response)), // Logs successful API response
            map((response) =>
              loadTransfersSuccess({
                payload: {
                  transfers: response.transfers,
                  pagination: {
                    currentPage: response.pagination.currentPage,
                    pageSize: response.pagination.pageSize,
                    totalItems: response.pagination.totalItems,
                    totalPages: response.pagination.totalPages,
                  },
                  totalIncome: response.totalIncome,
                  totalExpenses: response.totalExpenses,
                  sortOrder: response.sortOrder,
                },
              }),
            ),
            // tap(() => console.log('✅ Dispatching Success Action')), // Logs before success action is dispatched
            catchError((error) => {
              console.error('❌ API Error:', error); // Logs error response
              return of(
                loadTransfersError({
                  payload: error,
                }),
              );
            }),
          ),
      ),
    ),
  );

  addTransfer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addTransfer),
      // tap((action) => console.log('🔹 Action Dispatched:', action)),
      mergeMap(({ payload }) =>
        this.transferService
          .addTransfer(payload.userId, payload.newTransfer)
          .pipe(
            // tap((response) => console.log('✅ API Response:', response)),
            map((response) =>
              addTransferSuccess({
                payload: {
                  userId: payload.userId,
                  newTransfer: response.newTransfer,
                },
              }),
            ),
            // tap(() => console.log('✅ Dispatching Success Action')),
            catchError((error) => {
              console.error('❌ API Error:', error); // Logs error response
              return of(
                addTransferError({
                  payload: error,
                }),
              );
            }),
          ),
      ),
    ),
  );

  updateTransfer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateTransfer),
      // tap((action) => console.log('🔹 Action Dispatched:', action)),
      mergeMap(({ payload }) =>
        this.transferService
          .updateTransfer(
            payload.userId,
            payload.transaction_id,
            payload.changes,
          )
          .pipe(
            // tap(() => console.log('✅ Transfer updated Successfully')),
            map(() =>
              updateTransferSuccess({
                payload: {
                  userId: payload.userId,
                  transaction_id: payload.transaction_id,
                  updatedTransaction: payload.changes,
                },
              }),
            ),
            // tap(() => console.log('✅ Dispatching Success Action')),
            catchError((error) => {
              console.error('❌ API Error:', error);
              return of(
                updateTransferError({
                  payload: error,
                }),
              );
            }),
          ),
      ),
    ),
  );

  deleteTransfer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteTransfer),
      // tap((action) => console.log('🔹 Action Dispatched:', action)),
      mergeMap(({ payload }) =>
        this.transferService
          .deleteTransfer(payload.userId, payload.transaction_id)
          .pipe(
            // tap(() => console.log('✅ Transfer Deleted Successfully')),
            map(() =>
              deleteTransferSuccess({
                payload: {
                  userId: payload.userId,
                  transaction_id: payload.transaction_id,
                },
              }),
            ),
            catchError((error) => {
              console.error('❌ API Error:', error);
              return of(
                deleteTransferError({
                  payload: error,
                }),
              );
            }),
          ),
      ),
    ),
  );
}
