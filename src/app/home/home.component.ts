import { Component, OnInit } from '@angular/core';
import { AuthService } from '../Service/Auth/auth.service';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { TransactionState } from '../@Ngrx/transaction.state';
import {
  selectTotalIncome,
  selectTransactions,
} from '../@Ngrx/transaction.selectors';
import { Transaction } from '../Model/transaction.model';
import { loadTransactions } from '../@Ngrx/transaction.actions';

@Component({
  selector: 'app-home',
  standalone: false,

  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  //observable varibles that store data from select
  // transactions$: Observable<Transaction[]>;
  totalIncome$: Observable<number>;
  userId!: string;

  constructor(private store: Store, private authService: AuthService) {
    this.totalIncome$ = this.store.select(selectTotalIncome);
    // this.transactions$ = this.store.select(selectTransactions);
  }

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    if (this.userId) {
      this.store.dispatch(
        loadTransactions({ payload: { userId: this.userId } })
      );
    } else {
      console.error('Error Occured. Please try again later.');
    }
  }
}
