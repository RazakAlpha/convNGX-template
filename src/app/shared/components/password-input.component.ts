import {
  Component,
  input,
  output,
  signal,
  forwardRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-password-input',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PasswordInputComponent),
      multi: true,
    },
  ],
  template: `
    <div class="password-input" [class.disabled]="disabled()">
      <input
        [id]="id()"
        [type]="isVisible() ? 'text' : 'password'"
        [placeholder]="placeholder()"
        [class.error]="isInvalid()"
        [disabled]="disabled()"
        [value]="value()"
        (input)="onInput($event)"
        (blur)="onBlur()"
        [attr.aria-invalid]="isInvalid()"
        [attr.aria-describedby]="ariaDescribedBy()"
      />
      <button
        type="button"
        class="toggle-visibility"
        (click)="toggleVisibility()"
        [attr.aria-label]="isVisible() ? 'Hide password' : 'Show password'"
        [attr.aria-pressed]="isVisible()"
        [disabled]="disabled()"
      >
        @if (isVisible()) {
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path
              d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M1 1l22 22"
            ></path>
            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"></path>
          </svg>
        } @else {
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
        }
      </button>
    </div>
  `,
  styles: [
    `
      .password-input {
        position: relative;
        width: 100%;
      }

      .password-input.disabled {
        opacity: 0.5;
      }

      .password-input input {
        width: 100%;
        padding: 0.875rem 2.75rem 0.875rem 1rem;
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-lg);
        color: var(--color-text-primary);
        font-size: 1rem;
        transition: all var(--transition-normal);
      }

      .password-input input::placeholder {
        color: var(--color-text-muted);
      }

      .password-input input:hover:not(:disabled) {
        border-color: var(--color-border-hover);
      }

      .password-input input:focus {
        outline: none;
        border-color: var(--color-primary);
        box-shadow: 0 0 0 3px var(--color-primary-light);
      }

      .password-input input.error {
        border-color: var(--color-error);
      }

      .password-input input.error:focus {
        box-shadow: 0 0 0 3px var(--color-error-light);
      }

      .password-input input:disabled {
        cursor: not-allowed;
      }

      .toggle-visibility {
        position: absolute;
        right: 0.75rem;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        padding: 0.25rem;
        cursor: pointer;
        color: var(--color-text-muted);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: color var(--transition-fast);
        border-radius: var(--radius-sm);
      }

      .toggle-visibility:hover:not(:disabled) {
        color: var(--color-text-primary);
      }

      .toggle-visibility:focus-visible {
        outline: 2px solid var(--color-primary);
        outline-offset: 2px;
      }

      .toggle-visibility:disabled {
        cursor: not-allowed;
        opacity: 0.5;
      }
    `,
  ],
})
export class PasswordInputComponent implements ControlValueAccessor {
  id = input('');
  placeholder = input('Enter password');
  ariaDescribedBy = input('');

  valueChanged = output<string>();
  visibilityToggled = output<boolean>();

  private readonly _value = signal('');
  private readonly _isVisible = signal(false);
  private readonly _disabled = signal(false);
  private readonly _isInvalid = signal(false);
  private readonly touched = signal(false);
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  readonly value = this._value.asReadonly();
  readonly isVisible = this._isVisible.asReadonly();
  readonly disabled = this._disabled.asReadonly();
  readonly isInvalid = this._isInvalid.asReadonly();

  onInput(event: Event): void {
    const inputValue = (event.target as HTMLInputElement).value;
    this._value.set(inputValue);
    this.onChange(inputValue);
    this.valueChanged.emit(inputValue);
  }

  onBlur(): void {
    this.touched.set(true);
    this.onTouched();
  }

  toggleVisibility(): void {
    this._isVisible.update((current) => !current);
    this.visibilityToggled.emit(this._isVisible());
  }

  writeValue(value: string): void {
    this._value.set(value ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._disabled.set(isDisabled);
  }

  setInvalidState(isInvalid: boolean): void {
    this._isInvalid.set(isInvalid);
  }
}
