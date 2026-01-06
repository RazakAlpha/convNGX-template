import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { PasswordInputComponent } from '../../shared/components/password-input.component';
import { AuthLayoutComponent } from '../../shared/components/auth-layout.component';

@Component({
  selector: 'app-signup',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    PasswordInputComponent,
    AuthLayoutComponent,
  ],
  template: `
    <app-auth-layout>
      <div class="auth-card animate-fadeInUp">
        <div class="auth-card-header">
          <a routerLink="/" class="back-link">
            <span class="back-arrow">←</span>
            Back
          </a>
          <h2>Create account</h2>
          <p>Start building with real-time data</p>
        </div>

        <form [formGroup]="signupForm" (ngSubmit)="onSubmit()" class="auth-form">
          <div class="form-group">
            <label for="name">Full name</label>
            <input
              id="name"
              type="text"
              formControlName="name"
              placeholder="John Doe"
              autocomplete="name"
              [class.error]="signupForm.get('name')?.invalid && signupForm.get('name')?.touched"
            />
            @if (signupForm.get('name')?.invalid && signupForm.get('name')?.touched) {
              <span class="field-error">
                @if (signupForm.get('name')?.errors?.['required']) {
                  Name is required
                } @else if (signupForm.get('name')?.errors?.['minlength']) {
                  Name must be at least 2 characters
                }
              </span>
            }
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input
              id="email"
              type="email"
              formControlName="email"
              placeholder="you@example.com"
              autocomplete="email"
              [class.error]="signupForm.get('email')?.invalid && signupForm.get('email')?.touched"
            />
            @if (signupForm.get('email')?.invalid && signupForm.get('email')?.touched) {
              <span class="field-error">
                @if (signupForm.get('email')?.errors?.['required']) {
                  Email is required
                } @else if (signupForm.get('email')?.errors?.['email']) {
                  Enter a valid email address
                }
              </span>
            }
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <app-password-input
              id="password"
              [formControl]="$any(signupForm.get('password'))"
              placeholder="At least 6 characters"
            />
            @if (signupForm.get('password')?.invalid && signupForm.get('password')?.touched) {
              <span class="field-error">
                @if (signupForm.get('password')?.errors?.['required']) {
                  Password is required
                } @else if (signupForm.get('password')?.errors?.['minlength']) {
                  Password must be at least 6 characters
                }
              </span>
            }
          </div>

          <div class="form-group">
            <label for="confirmPassword">Confirm password</label>
            <app-password-input
              id="confirmPassword"
              [formControl]="$any(signupForm.get('confirmPassword'))"
              placeholder="Re-enter your password"
            />
            @if (
              signupForm.get('confirmPassword')?.invalid &&
              signupForm.get('confirmPassword')?.touched
            ) {
              <span class="field-error">
                @if (signupForm.get('confirmPassword')?.errors?.['required']) {
                  Please confirm your password
                } @else if (signupForm.get('confirmPassword')?.errors?.['passwordMismatch']) {
                  Passwords do not match
                }
              </span>
            }
          </div>

          @if (errorMessage()) {
            <div class="global-error" role="alert">
              <span class="error-icon">!</span>
              {{ errorMessage() }}
            </div>
          }

          <button
            type="submit"
            class="submit-btn"
            [disabled]="signupForm.invalid || isLoading()"
          >
            @if (isLoading()) {
              <span class="spinner"></span>
              Creating account...
            } @else {
              Create Account
              <span class="btn-arrow">→</span>
            }
          </button>
        </form>

        <div class="auth-footer">
          <p>Already have an account? <a routerLink="/signin">Sign in</a></p>
        </div>
      </div>
    </app-auth-layout>
  `,
  styles: [
    `
      .auth-card {
        width: 100%;
      }

      .auth-card-header {
        margin-bottom: 2rem;
      }

      .back-link {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        color: var(--color-text-muted);
        font-size: 0.875rem;
        margin-bottom: 1.5rem;
        transition: color var(--transition-fast);
      }

      .back-link:hover {
        color: var(--color-text-primary);
      }

      .back-arrow {
        font-size: 1.25rem;
        line-height: 1;
      }

      .auth-card-header h2 {
        font-size: 1.75rem;
        font-weight: 700;
        margin: 0 0 0.5rem;
        color: #fff;
      }

      .auth-card-header p {
        color: var(--color-text-muted);
        margin: 0;
      }

      .auth-form {
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
      }

      .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      label {
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--color-text-secondary);
      }

      input {
        width: 100%;
        padding: 0.875rem 1rem;
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-lg);
        color: var(--color-text-primary);
        font-size: 1rem;
        transition: all var(--transition-normal);
      }

      input::placeholder {
        color: var(--color-text-muted);
      }

      input:hover {
        border-color: var(--color-border-hover);
      }

      input:focus {
        outline: none;
        border-color: var(--color-primary);
        box-shadow: 0 0 0 3px var(--color-primary-light);
      }

      input.error {
        border-color: var(--color-error);
      }

      input.error:focus {
        box-shadow: 0 0 0 3px var(--color-error-light);
      }

      .field-error {
        font-size: 0.8125rem;
        color: var(--color-error);
      }

      .global-error {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.875rem 1rem;
        background: var(--color-error-light);
        border: 1px solid rgba(239, 68, 68, 0.2);
        border-radius: var(--radius-lg);
        color: var(--color-error);
        font-size: 0.875rem;
      }

      .error-icon {
        width: 20px;
        height: 20px;
        background: var(--color-error);
        color: #fff;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.75rem;
        font-weight: 700;
        flex-shrink: 0;
      }

      .submit-btn {
        width: 100%;
        padding: 0.875rem 1.5rem;
        background: var(--gradient-primary);
        color: #fff;
        border: none;
        border-radius: var(--radius-lg);
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        margin-top: 0.5rem;
        transition: all var(--transition-normal);
        box-shadow: var(--shadow-glow-primary);
      }

      .submit-btn:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 0 40px rgba(99, 102, 241, 0.5);
      }

      .submit-btn:active:not(:disabled) {
        transform: translateY(0);
      }

      .submit-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
      }

      .btn-arrow {
        transition: transform var(--transition-fast);
      }

      .submit-btn:hover:not(:disabled) .btn-arrow {
        transform: translateX(4px);
      }

      .spinner {
        width: 18px;
        height: 18px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-top-color: #fff;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }

      .auth-footer {
        margin-top: 2rem;
        text-align: center;
        padding-top: 1.5rem;
        border-top: 1px solid var(--color-border);
      }

      .auth-footer p {
        color: var(--color-text-muted);
        font-size: 0.9375rem;
        margin: 0;
      }

      .auth-footer a {
        color: var(--color-primary);
        font-weight: 500;
        transition: color var(--transition-fast);
      }

      .auth-footer a:hover {
        color: var(--color-accent-purple);
      }
    `,
  ],
})
export class SignupComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly signupForm: FormGroup;
  readonly isLoading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  constructor() {
    this.signupForm = this.fb.group(
      {
        name: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(control: AbstractControl) {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    return null;
  }

  async onSubmit() {
    if (this.signupForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set(null);

      try {
        const { name, email, password } = this.signupForm.value;
        await this.authService.signUp(email, password, name);
        this.router.navigate(['/chat']);
      } catch (error) {
        this.errorMessage.set(error instanceof Error ? error.message : 'Sign up failed');
      } finally {
        this.isLoading.set(false);
      }
    }
  }
}
