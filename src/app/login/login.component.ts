import { Component, OnInit } from '@angular/core';
import { AuthService } from '../Service/Auth/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ErrorHandlerService } from '../ErrorHandling/error-handler';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null;
  isPasswordVisible: boolean = false;

  constructor(
    private errorHandler: ErrorHandlerService,
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    //define the form group with strictly typed controls and validation
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
    //set error message initially to null
    this.errorMessage = null;
  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  login(): void {
    if (this.loginForm.valid) {
      //login success
      this.authService
        .Login(this.loginForm.value.email, this.loginForm.value.password)
        .subscribe({
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
            console.log(result, ' successfully login');
            this.router.navigateByUrl('/private');
          },
          error: (err) => {
            this.errorMessage = this.errorHandler.handleError(err);
          },
        });
    } else {
      console.log('Invalid form');
    }
  }

  logout() {
    this.authService.removestate();
  }
}
