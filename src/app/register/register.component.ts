import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../Service/Auth/auth.service';
import { ErrorHandlerService } from '../ErrorHandling/error-handler';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string | null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private errorHandler: ErrorHandlerService,
    private router: Router
  ) {
    //define the form group with strictly typed controls and validtion
    this.registerForm = this.fb.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
    //set errror message to null initially
    this.errorMessage = null;
  }

  get username() {
    return this.registerForm.get('username');
  }

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  register(): void {
    if (this.registerForm.valid) {
      //register success
      this.authService
        .Register(
          this.registerForm.value.username,
          this.registerForm.value.email,
          this.registerForm.value.password
        )
        .subscribe({
          next: (result) => {
            console.log('User registered success', result);
            this.router.navigateByUrl('/login');
          },
          error: (err) => {
            this.errorMessage = this.errorHandler.handleError(err);
          },
        });
    } else {
      console.log('Invalid form submission');
    }
  }
}
