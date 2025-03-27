import { Component, HostListener, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthService } from '../../../../Authentication/Service/auth.service';
import { resetTransactionStore } from '../../../@NgRx/Transactions/transaction.actions';
import { resetTransferStore } from '../../../@NgRx/Transfers/transfer.actions';

@Component({
  selector: 'app-navbar',
  standalone: false,

  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  mode!: string;
  user_initial: string = 'null';
  user_details: boolean = false;

  private authService = inject(AuthService);
  private router = inject(Router);
  private store = inject(Store);

  ngOnInit(): void {
    this.mode = localStorage.getItem('default_mode') || 'light';
    this.getInitital();
  }

  viewUserDetails() {
    this.user_details = !this.user_details;
  }

  changemode(user_preference: string) {
    this.mode = user_preference;
    localStorage.setItem('default_mode', user_preference);
  }

  getInitital() {
    this.user_initial = this.authService.getUserDetails('username')
      ? this.authService.getUserDetails('username').charAt(0)
      : 'null';
  }

  getUsername() {
    return this.authService.getUserDetails('username');
  }

  getEmail() {
    return this.authService.getUserDetails('email');
  }

  logout() {
    this.store.dispatch(resetTransactionStore());
    this.store.dispatch(resetTransferStore());
    this.authService.removestate();
    this.router.navigate(['/login']);
  }
}
