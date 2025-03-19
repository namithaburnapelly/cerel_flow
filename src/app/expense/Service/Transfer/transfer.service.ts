import { inject, Injectable } from '@angular/core';
import { environmentVariables } from '../../../../environment/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Transfer } from '../../Model/transfer.model';
import { TransferStore } from '../../@NgRx/Transfers/transfer.state';

@Injectable({
  providedIn: 'root',
})
export class TransferService {
  private _transferUrl = environmentVariables.transferUrl;
  private http = inject(HttpClient);
  constructor() {}

  getTransfers(
    userId: string,
    page: number,
    pageSize: number,
    sortOrder: string,
  ): Observable<TransferStore> {
    console.log('Service 🟡 Fetching Transfers:', {
      userId,
      page,
      pageSize,
      sortOrder,
    });

    const params = new HttpParams()
      .set('page', page)
      .set('pageSize', pageSize)
      .set('sortOrder', sortOrder);

    return this.http.get<TransferStore>(`${this._transferUrl}/${userId}`, {
      params,
    });
  }

  addTransfer(
    userId: string,
    newTransfer: Transfer,
  ): Observable<{ message: string; newTransfer: Transfer }> {
    console.log('service 🟢 Adding Transfer:', { userId, newTransfer });

    return this.http.post<{ message: string; newTransfer: Transfer }>(
      `${this._transferUrl}/${userId}`,
      newTransfer,
    );
  }

  updateTransfer(
    userId: string,
    transaction_id: string,
    changes: Partial<Transfer>,
  ): Observable<{ message: string; updatedTransaction: Transfer }> {
    console.log('service 🟢 updating Transfer:', {
      userId,
      transaction_id,
      changes,
    });

    return this.http.patch<{ message: string; updatedTransaction: Transfer }>(
      `${this._transferUrl}/${userId}/${transaction_id}`,
      changes,
    );
  }

  deleteTransfer(
    userId: string,
    transaction_id: string,
  ): Observable<{ message: string }> {
    console.log('service ❌ updating Transfer:', {
      userId,
      transaction_id,
    });

    return this.http.delete<{ message: string }>(
      `${this._transferUrl}/${userId}/${transaction_id}`,
    );
  }
}
