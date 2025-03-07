import { Component, inject } from '@angular/core';
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
export class NavbarComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private store = inject(Store);

  logout() {
    this.store.dispatch(resetTransactionStore());
    this.store.dispatch(resetTransferStore());
    this.authService.removestate();
    this.router.navigate(['/login']);
  }
}
