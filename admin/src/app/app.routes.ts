import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Edit } from './components/edit/edit';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { authGuard } from './guards/auth-guard';
import { loginGuard } from './guards/login-guard';

export const routes: Routes = [
  { path: '', redirectTo: '/edit', pathMatch: 'full' },
  { path: 'login', component: Login, canActivate: [loginGuard] },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'edit', component: Edit, canActivate: [authGuard] },
  { path: '**', redirectTo: '/edit' }
];
