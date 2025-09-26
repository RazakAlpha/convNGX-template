import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signin',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <h2>Sign In</h2>
        <form [formGroup]="signinForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="email">Email</label>
            <input
              id="email"
              type="email"
              formControlName="email"
              placeholder="Enter your email"
              [class.error]="signinForm.get('email')?.invalid && signinForm.get('email')?.touched"
            />
            @if (signinForm.get('email')?.invalid && signinForm.get('email')?.touched) {
              <div class="error-message">
                @if (signinForm.get('email')?.errors?.['required']) {
                  Email is required
                }
                @if (signinForm.get('email')?.errors?.['email']) {
                  Please enter a valid email
                }
              </div>
            }
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input
              id="password"
              type="password"
              formControlName="password"
              placeholder="Enter your password"
              [class.error]="
                signinForm.get('password')?.invalid && signinForm.get('password')?.touched
              "
            />
            @if (signinForm.get('password')?.invalid && signinForm.get('password')?.touched) {
              <div class="error-message">
                @if (signinForm.get('password')?.errors?.['required']) {
                  Password is required
                }
                @if (signinForm.get('password')?.errors?.['minlength']) {
                  Password must be at least 6 characters
                }
              </div>
            }
          </div>

          @if (errorMessage()) {
            <div class="error-message global-error">
              {{ errorMessage() }}
            </div>
          }

          <button
            type="submit"
            [disabled]="signinForm.invalid || isLoading()"
            class="submit-button"
          >
            @if (isLoading()) {
              Signing in...
            } @else {
              Sign In
            }
          </button>
        </form>

        <div class="auth-footer">
          <p>Don't have an account? <a routerLink="/signup">Sign up</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .auth-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 20px;
      }

      .auth-card {
        background: white;
        border-radius: 12px;
        padding: 2rem;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        width: 100%;
        max-width: 400px;
      }

      h2 {
        text-align: center;
        margin-bottom: 2rem;
        color: #333;
        font-weight: 600;
      }

      .form-group {
        margin-bottom: 1.5rem;
      }

      label {
        display: block;
        margin-bottom: 0.5rem;
        color: #555;
        font-weight: 500;
      }

      input {
        width: 100%;
        padding: 0.75rem;
        border: 2px solid #e1e5e9;
        border-radius: 8px;
        font-size: 1rem;
        transition: border-color 0.3s ease;
        box-sizing: border-box;
      }

      input:focus {
        outline: none;
        border-color: #667eea;
      }

      input.error {
        border-color: #e74c3c;
      }

      .error-message {
        color: #e74c3c;
        font-size: 0.875rem;
        margin-top: 0.25rem;
      }

      .global-error {
        background: #fdf2f2;
        border: 1px solid #fecaca;
        border-radius: 6px;
        padding: 0.75rem;
        margin-bottom: 1rem;
      }

      .submit-button {
        width: 100%;
        background: #667eea;
        color: white;
        border: none;
        padding: 0.875rem;
        border-radius: 8px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: background-color 0.3s ease;
      }

      .submit-button:hover:not(:disabled) {
        background: #5a67d8;
      }

      .submit-button:disabled {
        background: #a0aec0;
        cursor: not-allowed;
      }

      .auth-footer {
        text-align: center;
        margin-top: 1.5rem;
        color: #666;
      }

      .auth-footer a {
        color: #667eea;
        text-decoration: none;
        font-weight: 500;
      }

      .auth-footer a:hover {
        text-decoration: underline;
      }
    `,
  ],
})
export class SigninComponent {
  signinForm: FormGroup;
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.signinForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async onSubmit() {
    if (this.signinForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set(null);

      try {
        const { email, password } = this.signinForm.value;
        await this.authService.signIn(email, password);
        this.router.navigate(['/']);
      } catch (error) {
        this.errorMessage.set(error instanceof Error ? error.message : 'Sign in failed');
      } finally {
        this.isLoading.set(false);
      }
    }
  }
}
