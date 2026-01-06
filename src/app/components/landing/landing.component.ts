import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ROUTES } from '../../../lib/constants';

@Component({
  selector: 'app-landing',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="landing-page">
      <div class="landing-background">
        <div class="bg-shape shape-1"></div>
        <div class="bg-shape shape-2"></div>
        <div class="bg-shape shape-3"></div>
      </div>

      <header class="landing-header">
        <div class="logo">
          <span class="logo-icon">◇</span>
          <span class="logo-text">ConvNGX</span>
        </div>
        <nav class="nav-actions">
          <a [routerLink]="signInRoute" class="nav-link">Sign In</a>
          <a [routerLink]="signUpRoute" class="nav-btn">Get Started</a>
        </nav>
      </header>

      <main class="landing-content">
        <div class="hero-section">
          <h1 class="hero-title">
            Real-time apps,
            <span class="hero-highlight">simplified.</span>
          </h1>
          <p class="hero-description">
            A production-ready Angular template with Convex backend and secure authentication.
            Build reactive, real-time applications without the complexity.
          </p>
          <div class="hero-actions">
            <a [routerLink]="signUpRoute" class="btn-primary">
              Start Building
              <span class="btn-arrow">→</span>
            </a>
            <a href="https://github.com" target="_blank" rel="noopener" class="btn-secondary">
              View on GitHub
            </a>
          </div>
        </div>

        <div class="features-section">
          <div class="feature-card">
            <div class="feature-icon">⚡</div>
            <h3>Real-time Sync</h3>
            <p>Automatic data synchronization with Convex. No polling, no WebSocket setup.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🔒</div>
            <h3>Secure Auth</h3>
            <p>Built-in authentication with betterAuth. Email/password ready, OAuth extensible.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🎯</div>
            <h3>Type-Safe</h3>
            <p>End-to-end TypeScript with generated types. Catch errors at compile time.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">📱</div>
            <h3>Modern Angular</h3>
            <p>Signals, standalone components, and zoneless change detection for performance.</p>
          </div>
        </div>
      </main>

      <footer class="landing-footer">
        <p>Built with Angular 20 + Convex + betterAuth</p>
      </footer>
    </div>
  `,
  styles: [
    `
      .landing-page {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        position: relative;
        overflow: hidden;
        background: #0a0a0f;
        color: #e4e4e7;
        font-family: 'Satoshi', system-ui, -apple-system, sans-serif;
      }

      .landing-background {
        position: absolute;
        inset: 0;
        pointer-events: none;
        overflow: hidden;
      }

      .bg-shape {
        position: absolute;
        border-radius: 50%;
        filter: blur(80px);
        opacity: 0.4;
      }

      .shape-1 {
        width: 600px;
        height: 600px;
        background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
        top: -200px;
        right: -100px;
        animation: float 20s ease-in-out infinite;
      }

      .shape-2 {
        width: 400px;
        height: 400px;
        background: linear-gradient(135deg, #ec4899 0%, #f43f5e 100%);
        bottom: -100px;
        left: -100px;
        animation: float 15s ease-in-out infinite reverse;
      }

      .shape-3 {
        width: 300px;
        height: 300px;
        background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%);
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        animation: pulse 10s ease-in-out infinite;
      }

      @keyframes float {
        0%,
        100% {
          transform: translateY(0) rotate(0deg);
        }
        50% {
          transform: translateY(-30px) rotate(5deg);
        }
      }

      @keyframes pulse {
        0%,
        100% {
          transform: translate(-50%, -50%) scale(1);
          opacity: 0.3;
        }
        50% {
          transform: translate(-50%, -50%) scale(1.1);
          opacity: 0.5;
        }
      }

      .landing-header {
        position: relative;
        z-index: 10;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.5rem 3rem;
        backdrop-filter: blur(12px);
        background: rgba(10, 10, 15, 0.6);
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      }

      .logo {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-size: 1.25rem;
        font-weight: 700;
        letter-spacing: -0.02em;
      }

      .logo-icon {
        font-size: 1.5rem;
        background: linear-gradient(135deg, #6366f1, #8b5cf6);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .logo-text {
        background: linear-gradient(135deg, #fff 0%, #a1a1aa 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .nav-actions {
        display: flex;
        align-items: center;
        gap: 1.5rem;
      }

      .nav-link {
        color: #a1a1aa;
        text-decoration: none;
        font-size: 0.875rem;
        font-weight: 500;
        transition: color 0.2s ease;
      }

      .nav-link:hover {
        color: #fff;
      }

      .nav-btn {
        background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
        color: #fff;
        padding: 0.625rem 1.25rem;
        border-radius: 8px;
        text-decoration: none;
        font-size: 0.875rem;
        font-weight: 600;
        transition: all 0.2s ease;
        box-shadow: 0 0 20px rgba(99, 102, 241, 0.3);
      }

      .nav-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 0 30px rgba(99, 102, 241, 0.5);
      }

      .landing-content {
        flex: 1;
        position: relative;
        z-index: 10;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 6rem 2rem 4rem;
      }

      .hero-section {
        text-align: center;
        max-width: 800px;
        margin-bottom: 6rem;
      }

      .hero-title {
        font-size: clamp(2.5rem, 6vw, 4.5rem);
        font-weight: 800;
        line-height: 1.1;
        letter-spacing: -0.03em;
        margin: 0 0 1.5rem;
        color: #fff;
      }

      .hero-highlight {
        background: linear-gradient(135deg, #6366f1 0%, #ec4899 50%, #f43f5e 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .hero-description {
        font-size: 1.25rem;
        line-height: 1.7;
        color: #a1a1aa;
        margin: 0 0 2.5rem;
        max-width: 600px;
        margin-inline: auto;
      }

      .hero-actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
        flex-wrap: wrap;
      }

      .btn-primary {
        background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
        color: #fff;
        padding: 1rem 2rem;
        border-radius: 12px;
        text-decoration: none;
        font-size: 1rem;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        transition: all 0.3s ease;
        box-shadow: 0 4px 20px rgba(99, 102, 241, 0.4);
      }

      .btn-primary:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 30px rgba(99, 102, 241, 0.5);
      }

      .btn-arrow {
        transition: transform 0.2s ease;
      }

      .btn-primary:hover .btn-arrow {
        transform: translateX(4px);
      }

      .btn-secondary {
        background: rgba(255, 255, 255, 0.05);
        color: #e4e4e7;
        padding: 1rem 2rem;
        border-radius: 12px;
        text-decoration: none;
        font-size: 1rem;
        font-weight: 600;
        border: 1px solid rgba(255, 255, 255, 0.1);
        transition: all 0.3s ease;
      }

      .btn-secondary:hover {
        background: rgba(255, 255, 255, 0.1);
        border-color: rgba(255, 255, 255, 0.2);
        transform: translateY(-2px);
      }

      .features-section {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 1.5rem;
        width: 100%;
        max-width: 1000px;
      }

      .feature-card {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.06);
        border-radius: 16px;
        padding: 2rem;
        transition: all 0.3s ease;
        backdrop-filter: blur(8px);
      }

      .feature-card:hover {
        background: rgba(255, 255, 255, 0.05);
        border-color: rgba(255, 255, 255, 0.1);
        transform: translateY(-4px);
      }

      .feature-icon {
        font-size: 2rem;
        margin-bottom: 1rem;
        display: block;
      }

      .feature-card h3 {
        font-size: 1.125rem;
        font-weight: 700;
        margin: 0 0 0.75rem;
        color: #fff;
        letter-spacing: -0.01em;
      }

      .feature-card p {
        font-size: 0.9375rem;
        line-height: 1.6;
        color: #71717a;
        margin: 0;
      }

      .landing-footer {
        position: relative;
        z-index: 10;
        text-align: center;
        padding: 2rem;
        border-top: 1px solid rgba(255, 255, 255, 0.05);
      }

      .landing-footer p {
        font-size: 0.875rem;
        color: #52525b;
        margin: 0;
      }

      @media (max-width: 768px) {
        .landing-header {
          padding: 1rem 1.5rem;
        }

        .nav-actions {
          gap: 1rem;
        }

        .landing-content {
          padding: 4rem 1.5rem 3rem;
        }

        .hero-section {
          margin-bottom: 4rem;
        }

        .hero-description {
          font-size: 1.1rem;
        }

        .btn-primary,
        .btn-secondary {
          padding: 0.875rem 1.5rem;
          font-size: 0.9375rem;
        }

        .feature-card {
          padding: 1.5rem;
        }
      }
    `,
  ],
})
export class LandingComponent {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  readonly signInRoute = ROUTES.SIGN_IN;
  readonly signUpRoute = ROUTES.SIGN_UP;

  constructor() {
    if (this.authService.isAuthenticated()) {
      this.router.navigate([ROUTES.CHAT]);
    }
  }
}

