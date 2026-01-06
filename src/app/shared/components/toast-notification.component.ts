import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TOAST } from '../../../lib/constants';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

@Component({
  selector: 'app-toast-notification',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      @for (toast of toasts(); track toast.id) {
        <div
          class="toast toast-{{ toast.type }}"
          (click)="dismiss(toast.id)"
          role="alert"
          [attr.aria-live]="toast.type === 'error' ? 'assertive' : 'polite'"
        >
          <div class="toast-icon">
            @switch (toast.type) {
              @case ('success') {
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
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              }
              @case ('error') {
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
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="15" y1="9" x2="9" y2="15"></line>
                  <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
              }
              @case ('warning') {
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
                    d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
                  ></path>
                  <line x1="12" y1="9" x2="12" y2="13"></line>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
              }
              @case ('info') {
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
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
              }
            }
          </div>
          <span class="toast-message">{{ toast.message }}</span>
          <button class="toast-close" (click)="dismiss(toast.id)" aria-label="Close notification">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      }
    </div>
  `,
  styles: [
    `
      .toast-container {
        position: fixed;
        top: 1rem;
        right: 1rem;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        pointer-events: none;
      }

      .toast {
        pointer-events: auto;
        display: flex;
        align-items: flex-start;
        gap: 0.75rem;
        min-width: 320px;
        max-width: 420px;
        padding: 1rem;
        border-radius: var(--radius-lg);
        backdrop-filter: blur(12px);
        animation: slideIn 0.3s ease-out;
        cursor: pointer;
        transition: all var(--transition-fast);
      }

      .toast:hover {
        transform: translateX(-4px);
      }

      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }

      .toast-success {
        background: rgba(34, 197, 94, 0.15);
        border: 1px solid rgba(34, 197, 94, 0.3);
        color: var(--color-success);
      }

      .toast-error {
        background: rgba(239, 68, 68, 0.15);
        border: 1px solid rgba(239, 68, 68, 0.3);
        color: var(--color-error);
      }

      .toast-warning {
        background: rgba(245, 158, 11, 0.15);
        border: 1px solid rgba(245, 158, 11, 0.3);
        color: var(--color-warning);
      }

      .toast-info {
        background: rgba(59, 130, 246, 0.15);
        border: 1px solid rgba(59, 130, 246, 0.3);
        color: var(--color-info);
      }

      .toast-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        margin-top: 0.125rem;
      }

      .toast-message {
        flex: 1;
        font-size: 0.875rem;
        line-height: 1.5;
        color: var(--color-text-primary);
      }

      .toast-close {
        background: none;
        border: none;
        padding: 0.25rem;
        cursor: pointer;
        color: var(--color-text-muted);
        opacity: 0.7;
        transition: all var(--transition-fast);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        border-radius: var(--radius-sm);
      }

      .toast-close:hover {
        opacity: 1;
        background: rgba(255, 255, 255, 0.1);
      }

      @media (max-width: 640px) {
        .toast-container {
          left: 0.75rem;
          right: 0.75rem;
          top: 0.75rem;
        }

        .toast {
          min-width: auto;
          max-width: none;
        }
      }
    `,
  ],
})
export class ToastNotificationComponent {
  private readonly _toasts = signal<ToastMessage[]>([]);
  readonly toasts = this._toasts.asReadonly();

  show(message: string, type: ToastType = 'info', duration?: number): string {
    const toastDuration = duration ?? this.getDefaultDuration(type);
    const id = Math.random().toString(36).substring(2, 15);
    const toast: ToastMessage = { id, type, message, duration: toastDuration };

    this._toasts.update((current: ToastMessage[]) => [...current, toast]);

    if (toastDuration > 0) {
      setTimeout(() => {
        this.dismiss(id);
      }, toastDuration);
    }

    return id;
  }

  success(message: string, duration?: number): string {
    return this.show(message, 'success', duration);
  }

  error(message: string, duration?: number): string {
    return this.show(message, 'error', duration);
  }

  warning(message: string, duration?: number): string {
    return this.show(message, 'warning', duration);
  }

  info(message: string, duration?: number): string {
    return this.show(message, 'info', duration);
  }

  dismiss(id: string): void {
    this._toasts.update((current: ToastMessage[]) =>
      current.filter((toast: ToastMessage) => toast.id !== id),
    );
  }

  dismissAll(): void {
    this._toasts.set([]);
  }

  private getDefaultDuration(type: ToastType): number {
    switch (type) {
      case 'success':
        return TOAST.SUCCESS_DURATION;
      case 'error':
        return TOAST.ERROR_DURATION;
      case 'info':
        return TOAST.INFO_DURATION;
      case 'warning':
        return TOAST.WARNING_DURATION;
      default:
        return TOAST.INFO_DURATION;
    }
  }
}
