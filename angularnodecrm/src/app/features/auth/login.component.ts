import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth.service';
import { AlertComponent } from '../../shared/alert.component';

// PUBLIC_INTERFACE
@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, AlertComponent],
  selector: 'app-login',
  template: `
    <div class="auth-container">
      <h2>Login</h2>
      <app-alert *ngIf="error" [message]="error" (dismiss)="error=''"></app-alert>
      <form (ngSubmit)="login()" #loginForm="ngForm" autocomplete="on">
        <div class="form-group">
          <label>Email</label>
          <input name="email" type="email" [(ngModel)]="email" required email />
        </div>
        <div class="form-group">
          <label>Password</label>
          <input name="password" type="password" [(ngModel)]="password" required minlength="6" />
        </div>
        <button type="submit" [disabled]="loginForm.invalid">Login</button>
      </form>
      <div class="switch-link">
        New here? <a routerLink="/signup">Sign up</a>
      </div>
    </div>
  `,
  styles: [`
    .auth-container { max-width: 350px; margin: 4rem auto; padding: 2rem; border-radius: 10px; box-shadow: 0 0 12px #eee; background: #fff; }
    h2 { color: #19d27b; }
    .form-group { margin-bottom: 1.2rem; }
    label { display:block;font-size:1rem;color:#424242;font-weight: 600; margin-bottom: .3rem;}
    input { width: 100%; padding: 0.5rem; border:1px solid #ddd; border-radius:3px;font-size: 1rem;}
    button { width: 100%; background: #19d27b; color: #fff; font-weight: 500; border:none;padding:.6rem 0; border-radius:3px; font-size:1.15rem; margin-top:0.8rem;}
    button:disabled { background: #dadada; color: #424242 }
    .switch-link { margin-top:1.1rem; text-align: center;}
    .switch-link a { color: #ff8080; text-decoration: underline;}
  `]
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.error = '';
    this.authService.login(this.email.trim(), this.password).subscribe({
      next: () => this.router.navigateByUrl('/dashboard'),
      error: err => {
        this.error = err?.error?.message || 'Login failed. Please try again.';
      }
    });
  }
}
