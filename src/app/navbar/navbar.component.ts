import { Component, inject } from '@angular/core';
import { AuthService } from '../Service/Auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: false,

  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  constructor() {}
  logout() {
    this.authService.removestate();
    this.router.navigate(['/login']);
  }
}
