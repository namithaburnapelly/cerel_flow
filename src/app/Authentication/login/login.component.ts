import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../Service/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ErrorHandlerService } from '../../expense/utils/error-handler';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string | null;
  isPasswordVisible: boolean = false;

  private errorHandler = inject(ErrorHandlerService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);

  constructor() {
    //define the form group with strictly typed controls and validation
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
    //set error message initially to null
    this.errorMessage = null;
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['error']) this.errorMessage = params['error'];
    });
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
            // console.log(result, ' successfully login');
            this.router.navigateByUrl('/expense');
          },
          error: (err) => {
            this.errorMessage = this.errorHandler.handleError(err);
          },
        });
    } else {
      // console.log('Invalid form');
      this.loginForm.markAllAsTouched();
    }
  }

  logout() {
    this.authService.removestate();
  }
}
