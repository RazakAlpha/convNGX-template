import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <h2>Sign Up</h2>
        <form [formGroup]="signupForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="name">Name</label>
            <input
              id="name"
              type="text"
              formControlName="name"
              placeholder="Enter your name"
              [class.error]="signupForm.get('name')?.invalid && signupForm.get('name')?.touched"
            />
            @if (signupForm.get('name')?.invalid && signupForm.get('name')?.touched) {
              <div class="error-message">
                @if (signupForm.get('name')?.errors?.['required']) {
                  Name is required
                }
                @if (signupForm.get('name')?.errors?.['minlength']) {
                  Name must be at least 2 characters
                }
              </div>
            }
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input
              id="email"
              type="email"
              formControlName="email"
              placeholder="Enter your email"
              [class.error]="signupForm.get('email')?.invalid && signupForm.get('email')?.touched"
            />
            @if (signupForm.get('email')?.invalid && signupForm.get('email')?.touched) {
              <div class="error-message">
                @if (signupForm.get('email')?.errors?.['required']) {
                  Email is required
                }
                @if (signupForm.get('email')?.errors?.['email']) {
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
                signupForm.get('password')?.invalid && signupForm.get('password')?.touched
              "
            />
            @if (signupForm.get('password')?.invalid && signupForm.get('password')?.touched) {
              <div class="error-message">
                @if (signupForm.get('password')?.errors?.['required']) {
                  Password is required
                }
                @if (signupForm.get('password')?.errors?.['minlength']) {
                  Password must be at least 6 characters
                }
              </div>
            }
          </div>

          <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              formControlName="confirmPassword"
              placeholder="Confirm your password"
              [class.error]="
                signupForm.get('confirmPassword')?.invalid &&
                signupForm.get('confirmPassword')?.touched
              "
            />
            @if (
              signupForm.get('confirmPassword')?.invalid &&
              signupForm.get('confirmPassword')?.touched
            ) {
              <div class="error-message">
                @if (signupForm.get('confirmPassword')?.errors?.['required']) {
                  Please confirm your password
                }
                @if (signupForm.get('confirmPassword')?.errors?.['passwordMismatch']) {
                  Passwords do not match
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
            [disabled]="signupForm.invalid || isLoading()"
            class="submit-button"
          >
            @if (isLoading()) {
              Creating account...
            } @else {
              Sign Up
            }
          </button>
        </form>

        <div class="auth-footer">
          <p>Already have an account? <a routerLink="/signin">Sign in</a></p>
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
export class SignupComponent {
  signupForm: FormGroup;
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.signupForm = this.fb.group(
      {
        name: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator },
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
      console.log(this.signupForm.value);
      this.isLoading.set(true);
      this.errorMessage.set(null);

      try {
        const { name, email, password } = this.signupForm.value;
        await this.authService.signUp(email, password, name);
        this.router.navigate(['/']);
      } catch (error) {
        this.errorMessage.set(error instanceof Error ? error.message : 'Sign up failed');
      } finally {
        this.isLoading.set(false);
      }
    }
  }
}
