import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-indicator',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <div class="loading-indicator" [class]="size()">
      <div class="spinner"></div>
      @if (message()) {
        <p class="loading-message">{{ message() }}</p>
      }
    </div>
  `,
  styles: [
    `
      .loading-indicator {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        padding: 2rem;
      }

      .small {
        padding: 1rem;
        gap: 0.75rem;
      }

      .medium {
        padding: 2rem;
      }

      .large {
        padding: 3rem;
      }

      .spinner {
        width: 40px;
        height: 40px;
        border: 3px solid var(--color-border);
        border-top-color: var(--color-primary);
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
      }

      .small .spinner {
        width: 24px;
        height: 24px;
        border-width: 2px;
      }

      .large .spinner {
        width: 56px;
        height: 56px;
        border-width: 4px;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }

      .loading-message {
        color: var(--color-text-muted);
        font-size: 0.9375rem;
        margin: 0;
        text-align: center;
      }

      .small .loading-message {
        font-size: 0.8125rem;
      }

      .large .loading-message {
        font-size: 1rem;
      }
    `,
  ],
})
export class LoadingIndicatorComponent {
  size = input<'small' | 'medium' | 'large'>('medium');
  message = input<string>('');
}
