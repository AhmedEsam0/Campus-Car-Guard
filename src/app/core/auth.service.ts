import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { User } from '../models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();
  apiBase = 'https://api.your-university.edu'; // عدّلها حسب الـ backend

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post<{ token?: string; user: User }>(`${this.apiBase}/auth/login`, { email, password }).pipe(
      tap(res => {
        if (res?.token) {
          localStorage.setItem('token', res.token);
        }
        if (res?.user) this.userSubject.next(res.user);
      }),
      catchError(err => {
        console.error(err);
        return of(null);
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.userSubject.next(null);
  }

  get token() {
    return localStorage.getItem('token');
  }

  get currentUser() {
    return this.userSubject.value;
  }
}
