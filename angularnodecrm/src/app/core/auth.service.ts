import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

const STORAGE_KEY = 'nodecrm_auth_token';

// PUBLIC_INTERFACE
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _tokenSubject = new BehaviorSubject<string|null>(this.getToken());
  public isAuthenticated$ = this._tokenSubject.asObservable();

  /** Retrieves JWT token from local storage. */
  getToken(): string | null {
    if (typeof globalThis.localStorage !== 'undefined') {
      return globalThis.localStorage.getItem(STORAGE_KEY);
    }
    return null;
  }

  /** Stores JWT token to local storage. */
  setToken(token: string): void {
    if (typeof globalThis.localStorage !== 'undefined') {
      globalThis.localStorage.setItem(STORAGE_KEY, token);
    }
    this._tokenSubject.next(token);
  }

  /** Clears authentication token. */
  clearToken(): void {
    if (typeof globalThis.localStorage !== 'undefined') {
      globalThis.localStorage.removeItem(STORAGE_KEY);
    }
    this._tokenSubject.next(null);
  }

  /** PUBLIC_INTERFACE: Authenticates user and saves JWT. */
  login(email: string, password: string): Observable<{token: string}> {
    const http = inject(HttpClient);
    return http.post<{token:string}>('/api/auth/login', {email, password}).pipe(
      tap(res => {
        if (res.token) { this.setToken(res.token); }
      }),
      catchError(err => {
        this.clearToken();
        throw err;
      })
    );
  }

  /** PUBLIC_INTERFACE: Registers user and saves JWT. */
  signup(name: string, email: string, password: string): Observable<{token:string}> {
    const http = inject(HttpClient);
    return http.post<{token:string}>('/api/auth/signup', {name, email, password}).pipe(
      tap(res => {
        if (res.token) { this.setToken(res.token); }
      }),
      catchError(err => {
        this.clearToken();
        throw err;
      })
    );
  }

  /** PUBLIC_INTERFACE: Attempts automatic login with stored token. */
  autoLogin(): boolean {
    const token = this.getToken();
    if (token) {
      this._tokenSubject.next(token);
      return true;
    }
    return false;
  }

  /** PUBLIC_INTERFACE: Logs out user completely. */
  logout(): void {
    this.clearToken();
  }
}
