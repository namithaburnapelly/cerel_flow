import { Component } from '@angular/core';
import { AuthService } from '../Service/Auth/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm: FormGroup;
  formSubmitted: boolean;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    //form submission initialization
    this.formSubmitted = false;
    //define the form group with strictly typed controls and validation
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  ngOnInit(): void {}

  login(): void {
    if (this.loginForm.valid) {
      console.log('Form submitted', this.loginForm.value);

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
            console.log(result, ' from login component');
            this.router.navigateByUrl('/private/home');
          },
          error: (err) => {
            console.error('login failed', err);
          },
        });
    } else {
      console.log('form invalid');
    }
  }

  logout() {
    this.authService.removestate();
  }
}
