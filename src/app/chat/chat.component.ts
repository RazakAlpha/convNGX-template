import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ChatService, type MessageWithUser } from '../services/chat.service';
import { LoadingIndicatorComponent } from '../shared/components/loading-indicator.component';
import { ChatListComponent } from './chat-list.component';
import { ChatInputComponent } from './chat-input.component';

@Component({
  selector: 'app-chat',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink, LoadingIndicatorComponent, ChatListComponent, ChatInputComponent],
  template: `
    <div class="chat-container">
      <header class="chat-header">
        <div class="header-left">
          <a routerLink="/" class="logo">
            <span class="logo-icon">◇</span>
            <span class="logo-text">ConvNGX</span>
          </a>
        </div>
        <div class="header-right">
          <div class="user-badge">
            <span class="user-avatar">
              {{ chatService.getUserInitials(user()?.name, user()?.email) }}
            </span>
            <span class="user-name">{{ chatService.getDisplayName(user()?.name, user()?.email) }}</span>
          </div>
          <button (click)="signOut()" class="signout-btn" [disabled]="authService.isLoading()">
            @if (authService.isLoading()) {
              <span class="spinner-sm"></span>
            } @else {
              Sign Out
            }
          </button>
        </div>
      </header>

      <main class="chat-main">
        @if (authService.isLoading()) {
          <div class="loading-state">
            <app-loading-indicator [message]="'Loading...'" />
          </div>
        } @else if (!authService.isAuthenticated()) {
          <div class="not-authenticated">
            <div class="empty-icon">🔒</div>
            <h2>Authentication Required</h2>
            <p>You must be signed in to view the chat.</p>
            <a routerLink="/signin" class="btn-primary">Sign In</a>
          </div>
        } @else {
          <div class="chat-content">
            @if (chatService.isLoadingMessages() && chatService.displayMessages.length === 0) {
              <div class="loading-state">
                <app-loading-indicator [message]="'Loading messages...'" />
              </div>
            } @else if (chatService.displayMessages.length === 0) {
              <div class="empty-state">
                <div class="empty-icon">💬</div>
                <h2>Welcome to the chat!</h2>
                <p>Start the conversation by sending your first message below.</p>
              </div>
            } @else {
              <app-chat-list [messages]="chatService.displayMessages" />
            }

            <div class="chat-input-area">
              @if (chatService.error()) {
                <div class="error-banner" role="alert">
                  <span class="error-icon">!</span>
                  <span class="error-text">{{ chatService.error() }}</span>
                  <button (click)="chatService.clearError()" class="error-dismiss">×</button>
                </div>
              }

              <app-chat-input
                (messageSubmit)="handleSendMessage($event)"
                [disabled]="chatService.isLoading()"
                [maxCharacters]="1000"
              />
            </div>
          </div>
        }
      </main>
    </div>
  `,
  styles: [
    `
      .chat-container {
        display: flex;
        flex-direction: column;
        height: 100vh;
        background: var(--color-background);
      }

      .chat-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 1.5rem;
        background: var(--color-surface);
        border-bottom: 1px solid var(--color-border);
        flex-shrink: 0;
      }

      .header-left {
        display: flex;
        align-items: center;
      }

      .logo {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        text-decoration: none;
        font-weight: 700;
        font-size: 1.125rem;
      }

      .logo-icon {
        font-size: 1.25rem;
        background: var(--gradient-primary);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .logo-text {
        color: #fff;
      }

      .header-right {
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .user-badge {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.375rem 0.75rem 0.375rem 0.375rem;
        background: var(--color-surface-elevated);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-full);
      }

      .user-avatar {
        width: 28px;
        height: 28px;
        background: var(--gradient-primary);
        color: #fff;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.75rem;
        font-weight: 600;
      }

      .user-name {
        font-size: 0.875rem;
        color: var(--color-text-secondary);
        font-weight: 500;
      }

      .signout-btn {
        padding: 0.5rem 1rem;
        background: var(--color-surface);
        color: var(--color-text-secondary);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        font-size: 0.875rem;
        font-weight: 500;
        cursor: pointer;
        transition: all var(--transition-fast);
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .signout-btn:hover:not(:disabled) {
        background: var(--color-surface-elevated);
        border-color: var(--color-border-hover);
        color: var(--color-text-primary);
      }

      .signout-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .spinner-sm {
        width: 14px;
        height: 14px;
        border: 2px solid var(--color-border);
        border-top-color: var(--color-primary);
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }

      .chat-main {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }

      .chat-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }

      .loading-state,
      .empty-state,
      .not-authenticated {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 2rem;
        text-align: center;
      }

      .empty-icon {
        font-size: 3rem;
        margin-bottom: 1rem;
      }

      .empty-state h2,
      .not-authenticated h2 {
        font-size: 1.5rem;
        margin: 0 0 0.5rem;
        color: #fff;
      }

      .empty-state p,
      .not-authenticated p {
        color: var(--color-text-muted);
        margin: 0 0 1.5rem;
      }

      .btn-primary {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 1.5rem;
        background: var(--gradient-primary);
        color: #fff;
        border-radius: var(--radius-lg);
        font-weight: 600;
        text-decoration: none;
        transition: all var(--transition-normal);
        box-shadow: var(--shadow-glow-primary);
      }

      .btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 0 40px rgba(99, 102, 241, 0.5);
      }

      .chat-input-area {
        padding: 1rem 1.5rem;
        background: var(--color-surface);
        border-top: 1px solid var(--color-border);
        flex-shrink: 0;
      }

      .error-banner {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.75rem 1rem;
        margin-bottom: 1rem;
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

      .error-text {
        flex: 1;
      }

      .error-dismiss {
        background: none;
        border: none;
        color: var(--color-error);
        font-size: 1.25rem;
        cursor: pointer;
        padding: 0;
        line-height: 1;
        opacity: 0.7;
        transition: opacity var(--transition-fast);
      }

      .error-dismiss:hover {
        opacity: 1;
      }

      @media (max-width: 640px) {
        .chat-header {
          padding: 0.75rem 1rem;
        }

        .user-name {
          display: none;
        }

        .user-badge {
          padding: 0.25rem;
        }

        .chat-input-area {
          padding: 0.75rem 1rem;
        }
      }
    `,
  ],
})
export class ChatComponent {
  private readonly router = inject(Router);
  readonly authService = inject(AuthService);
  readonly chatService = inject(ChatService);

  readonly user = this.authService.user;

  async signOut(): Promise<void> {
    try {
      await this.authService.signOut();
      this.router.navigate(['/signin']);
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  }

  navigateToSignIn(): void {
    this.router.navigate(['/signin']);
  }

  async handleSendMessage(content: string): Promise<void> {
    try {
      await this.chatService.sendMessage(content);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  }
}
