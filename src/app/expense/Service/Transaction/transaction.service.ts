import { inject, Injectable } from '@angular/core';
import { environmentVariables } from '../../../../environment/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transaction } from '../../Model/transaction.model';
import { TransactionState } from '../../@NgRx/Transactions/transaction.state';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private _transactionsUrl = environmentVariables.transactionUrl;
  private http = inject(HttpClient);
  constructor() {}

  getTransactions(
    userId: string,
    page: number,
    pageSize: number,
    sortOrder: string,
  ): Observable<TransactionState> {
    // console.log('Service 🟡 Fetching Transactions:', {
    //   userId,
    //   page,
    //   pageSize,
    //   sortOrder,
    // });

    const params = new HttpParams()
      .set('page', page)
      .set('pageSize', pageSize)
      .set('sortOrder', sortOrder);

    return this.http.get<TransactionState>(
      `${this._transactionsUrl}/${userId}`,
      {
        params,
      },
    );
  }

  addTransaction(
    userId: string,
    newTransaction: Transaction,
  ): Observable<{ message: string; newTransaction: Transaction }> {
    // console.log('service 🟢 Adding Transaction:', { userId, newTransaction });

    return this.http.post<{ message: string; newTransaction: Transaction }>(
      `${this._transactionsUrl}/${userId}`,
      newTransaction,
    );
  }

  updateTransaction(
    userId: string,
    transaction_id: string,
    changes: Partial<Transaction>,
  ): Observable<{ message: string; updatedTransaction: Transaction }> {
    // console.log('service 🟢 updating Transaction:', {
    //   userId,
    //   transaction_id,
    //   changes,
    // });

    return this.http.patch<{
      message: string;
      updatedTransaction: Transaction;
    }>(`${this._transactionsUrl}/${userId}/${transaction_id}`, changes);
  }

  deleteTransaction(
    userId: string,
    transaction_id: string,
  ): Observable<{ message: string }> {
    // console.log('service ❌ updating Transaction:', {
    //   userId,
    //   transaction_id,
    // });

    return this.http.delete<{ message: string }>(
      `${this._transactionsUrl}/${userId}/${transaction_id}`,
    );
  }
}
