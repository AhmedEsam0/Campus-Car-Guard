import { Routes } from '@angular/router';
import { AuthGuard } from './core/auth.guard';
import { Login } from './login/login';
import { Scan } from './scan/scan';
import { History } from './history/history';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'scan', component: Scan },
  { path: 'history', component: History },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
];
