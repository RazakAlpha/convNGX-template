import { Component, input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  template: `
    <div class="auth-layout">
      <div class="auth-background">
        <div class="bg-shape shape-1"></div>
        <div class="bg-shape shape-2"></div>
      </div>

      <div class="auth-container">
        @if (showHeader()) {
          <div class="auth-header">
            <h1>{{ title() }}</h1>
            @if (subtitle()) {
              <p class="subtitle">{{ subtitle() }}</p>
            }
          </div>
        }
        <ng-content />
      </div>
    </div>
  `,
  styles: [
    `
      .auth-layout {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        padding: 2rem;
        position: relative;
        overflow: hidden;
      }

      .auth-background {
        position: absolute;
        inset: 0;
        pointer-events: none;
        overflow: hidden;
      }

      .bg-shape {
        position: absolute;
        border-radius: 50%;
        filter: blur(100px);
        opacity: 0.35;
      }

      .shape-1 {
        width: 500px;
        height: 500px;
        background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
        top: -150px;
        right: -100px;
        animation: float 18s ease-in-out infinite;
      }

      .shape-2 {
        width: 400px;
        height: 400px;
        background: linear-gradient(135deg, #ec4899 0%, #f43f5e 100%);
        bottom: -100px;
        left: -100px;
        animation: float 15s ease-in-out infinite reverse;
      }

      @keyframes float {
        0%,
        100% {
          transform: translateY(0) rotate(0deg);
        }
        50% {
          transform: translateY(-20px) rotate(3deg);
        }
      }

      .auth-container {
        position: relative;
        z-index: 10;
        background: var(--color-surface-elevated);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-xl);
        padding: 2.5rem;
        width: 100%;
        max-width: 420px;
        backdrop-filter: blur(20px);
        box-shadow: var(--shadow-lg);
      }

      .auth-header {
        text-align: center;
        margin-bottom: 2rem;
      }

      .auth-header h1 {
        margin: 0 0 0.5rem 0;
        font-size: 1.75rem;
        font-weight: 700;
        color: #fff;
      }

      .subtitle {
        margin: 0;
        color: var(--color-text-muted);
        font-size: 0.9375rem;
      }

      @media (max-width: 640px) {
        .auth-layout {
          padding: 1rem;
        }

        .auth-container {
          padding: 2rem 1.5rem;
          max-width: 100%;
        }

        .auth-header h1 {
          font-size: 1.5rem;
        }
      }
    `,
  ],
})
export class AuthLayoutComponent {
  title = input('Welcome');
  subtitle = input<string>('');
  showHeader = input(false);
}
