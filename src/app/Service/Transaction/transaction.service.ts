import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Transaction } from '../../Model/transaction.model';
import { Store } from '@ngrx/store';
import { loadTransactions } from '../../@Ngrx/transaction.actions';
import { TransactionState } from '../../@Ngrx/transaction.state';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private _transactionsUrl = environment.transactionUrl;
  private http = inject(HttpClient);
  private store = inject(Store);
  constructor() {}

  getTransactions(
    userId: string,
    page: number,
    pageSize: number
  ): Observable<TransactionState> {
    const params: any = {
      userId,
      page,
      pageSize,
    };
    return this.http.get<TransactionState>(
      `${this._transactionsUrl}/${userId}`,
      {
        params,
      }
    );
  }

  loadTransactions(userId: string, page: number, pageSize: number) {
    this.store.dispatch(
      loadTransactions({
        payload: {
          userId: userId,
          page: page,
          pageSize: pageSize,
        },
      })
    );
  }

  addTransaction(
    userId: string,
    newTransaction: Transaction
  ): Observable<{ newTransaction: Transaction }> {
    return this.http
      .post<Transaction>(`${this._transactionsUrl}/${userId}`, newTransaction)
      .pipe(
        map((transaction: Transaction) => {
          // Wrap the response in an object with newTransaction as key
          return { newTransaction: transaction };
        })
      );
  }

  updateTransaction(
    userId: string,
    transactionId: string,
    changes: Partial<Transaction>
  ): Observable<{ message: string }> {
    return this.http.patch<{ message: string }>(
      `${this._transactionsUrl}/${userId}/${transactionId}`,
      changes
    );
  }

  deleteTransaction(
    userId: string,
    transactionId: string
  ): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${this._transactionsUrl}/${userId}/${transactionId}`
    );
  }
}
