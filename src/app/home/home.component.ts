import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../Service/Auth/auth.service';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import {
  selectNetBalance,
  selectTotalExpenses,
  selectTotalIncome,
} from '../@Ngrx/transaction.selectors';
import { loadTransactions } from '../@Ngrx/transaction.actions';

@Component({
  selector: 'app-home',
  standalone: false,

  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  //observable varibles that store data from select
  totalIncome$: Observable<number>;
  totalExpenses$: Observable<number>;
  netBalance$: Observable<number>;

  userId!: string;
  today: Date = new Date();

  private store = inject(Store);
  private authService = inject(AuthService);

  constructor() {
    this.totalIncome$ = this.store.select(selectTotalIncome);
    this.totalExpenses$ = this.store.select(selectTotalExpenses);
    this.netBalance$ = this.store.select(selectNetBalance);
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
