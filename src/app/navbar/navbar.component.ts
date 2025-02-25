import { Component, inject } from '@angular/core';
import { AuthService } from '../Service/Auth/auth.service';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { resetTransactionState } from '../@Ngrx/transaction.actions';

@Component({
  selector: 'app-navbar',
  standalone: false,

  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private store = inject(Store);

  logout() {
    this.store.dispatch(resetTransactionState());
    this.authService.removestate();
    this.router.navigate(['/login']);
  }
}
