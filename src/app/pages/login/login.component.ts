import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="login-container">
      <div class="glass-card login-card">
        <h2 class="title">Welcome Back</h2>
        <p class="subtitle">Access your portfolio dashboard</p>

        <form (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label class="form-label">Email</label>
            <input type="email" [(ngModel)]="email" name="email" class="form-input" placeholder="admin@gmail.com" required>
          </div>

          <div class="form-group">
            <label class="form-label">Password</label>
            <input type="password" [(ngModel)]="password" name="password" class="form-input" placeholder="••••••••" required>
          </div>

          <div *ngIf="errorMessage()" class="error-banner">
            {{ errorMessage() }}
          </div>

          <button type="submit" class="btn btn-primary w-full" [disabled]="isLoading()">
            {{ isLoading() ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>
      </div>
    </div>
  `,
    styles: [`
    .login-container {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background: radial-gradient(circle at top left, #2e1065, #0f172a);
    }
    .login-card {
      width: 100%;
      max-width: 400px;
      padding: 3rem 2rem;
    }
    .title {
      font-size: 2rem;
      font-weight: 700;
      text-align: center;
      margin-bottom: 0.5rem;
      background: linear-gradient(to right, #fff, #94a3b8);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .subtitle {
      text-align: center;
      color: var(--text-muted);
      margin-bottom: 2rem;
    }
    .w-full {
      width: 100%;
    }
    .error-banner {
      background: rgba(239, 68, 68, 0.1);
      color: var(--error);
      padding: 0.75rem;
      border-radius: var(--radius-md);
      margin-bottom: 1.5rem;
      text-align: center;
      font-size: 0.9rem;
    }
  `]
})
export class LoginComponent {
    private authService = inject(AuthService);
    private router = inject(Router);

    email = '';
    password = '';
    isLoading = signal(false);
    errorMessage = signal('');

    onSubmit() {
        if (!this.email || !this.password) return;

        this.isLoading.set(true);
        this.errorMessage.set('');

        this.authService.login({ email: this.email, password: this.password }).subscribe({
            next: () => {
                this.isLoading.set(false);
                this.router.navigate(['/dashboard']);
            },
            error: (err) => {
                this.isLoading.set(false);
                this.errorMessage.set('Invalid credentials or server error.');
                console.error(err);
            }
        });
    }
}
