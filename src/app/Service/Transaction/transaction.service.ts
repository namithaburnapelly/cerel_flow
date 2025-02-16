import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Transaction } from '../../Model/transaction.model';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private _transactionsUrl = environment.transactionUrl;
  constructor(private http: HttpClient) {}

  getTransactions(userId: string): Observable<{ transactions: Transaction[] }> {
    return this.http.get<{ transactions: Transaction[] }>(
      `${this._transactionsUrl}/${userId}`
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
