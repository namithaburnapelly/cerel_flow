import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Authentication/login/login.component';
import { RegisterComponent } from './Authentication/register/register.component';
import { LoginResolve } from './Authentication/Service/login-resolve.service';
import { AuthGaurd } from './Authentication/Service/auth-gaurd.service';

const routes: Routes = [
  //private path for home page
  {
    path: 'private',
    loadChildren: () =>
      import('./expense/expense.module').then((m) => m.ExpenseModule),
    canActivate: [AuthGaurd],
  },
  //public paths
  {
    path: 'login',
    component: LoginComponent,
    resolve: {
      userInfo: LoginResolve, //resolve the user info before  activating the login component
    },
  },
  { path: 'register', component: RegisterComponent },
  // redirect path to login for user to access private data
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
