import { Component } from '@angular/core';
import { AuthService } from '../Service/Auth/auth.service';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}

  login() {
    this.authService.Login('username', 'password').subscribe({
      next: (result) => {
        // if (this.authService.isAuthenticated()) {
        //   console.log('user authenticated');

        //   const headers = new HttpHeaders()
        //     .set('Content-type', 'application/json')
        //     .set('Authorization', `Bearer ${this.authService.getToken()}`);

        //   this.http
        //     .get('http://localhost:3000/private/home', { headers })
        //     .subscribe((res) => {
        //       console.log(res);
        //     });

        // } else {
        //   console.log('forbidden access');
        //   this.router.navigateByUrl('');
        // }
        console.log(result, ' from login component');
        this.router.navigateByUrl('/private/home');
      },
      error: (err) => {
        console.error('login failed', err);
      },
    });
  }

  logout() {
    this.authService.removestate();
  }
}
