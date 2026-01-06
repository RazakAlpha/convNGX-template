import {
  Component,
  input,
  output,
  inject,
  effect,
  ViewChild,
  ElementRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatService, type MessageWithUser } from '../services/chat.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-chat-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <div class="chat-list" #chatList>
      @for (message of messages(); track message.message._id) {
        <div
          class="message-row animate-fadeInUp"
          [class.is-own]="isOwnMessage(message.message.userId)"
          [style.animation-delay]="$index * 30 + 'ms'"
        >
          <div class="message-avatar">
            {{ chatService.getUserInitials(message.user?.name, message.user?.email) }}
          </div>

          <div class="message-bubble">
            <div class="message-header">
              <span class="message-author">
                {{ chatService.getDisplayName(message.user?.name, message.user?.email) }}
              </span>
              <span
                class="message-time"
                [attr.aria-label]="getFullTime(message.message.createdAt)"
              >
                {{ chatService.formatTime(message.message.createdAt) }}
              </span>
            </div>

            <div class="message-content">
              {{ message.message.content }}
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [
    `
      .chat-list {
        flex: 1;
        overflow-y: auto;
        padding: 1.5rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .message-row {
        display: flex;
        gap: 0.75rem;
        max-width: 85%;
        animation: fadeInUp 0.3s ease-out both;
      }

      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .message-row.is-own {
        flex-direction: row-reverse;
        margin-left: auto;
      }

      .message-avatar {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: var(--gradient-primary);
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        font-size: 0.8125rem;
        flex-shrink: 0;
      }

      .message-row.is-own .message-avatar {
        background: var(--gradient-accent);
      }

      .message-bubble {
        display: flex;
        flex-direction: column;
        gap: 0.375rem;
      }

      .message-row.is-own .message-bubble {
        align-items: flex-end;
      }

      .message-header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0 0.25rem;
      }

      .message-row.is-own .message-header {
        flex-direction: row-reverse;
      }

      .message-author {
        font-size: 0.8125rem;
        font-weight: 600;
        color: var(--color-text-secondary);
      }

      .message-time {
        font-size: 0.75rem;
        color: var(--color-text-muted);
      }

      .message-content {
        background: var(--color-surface-elevated);
        border: 1px solid var(--color-border);
        padding: 0.75rem 1rem;
        border-radius: 16px;
        border-top-left-radius: 4px;
        color: var(--color-text-primary);
        line-height: 1.5;
        word-wrap: break-word;
        max-width: 100%;
      }

      .message-row.is-own .message-content {
        background: var(--gradient-primary);
        border: none;
        color: #fff;
        border-top-left-radius: 16px;
        border-top-right-radius: 4px;
      }

      @media (max-width: 640px) {
        .chat-list {
          padding: 1rem;
          gap: 0.75rem;
        }

        .message-row {
          max-width: 90%;
        }

        .message-avatar {
          width: 32px;
          height: 32px;
          font-size: 0.75rem;
        }

        .message-content {
          padding: 0.625rem 0.875rem;
          font-size: 0.9375rem;
        }
      }
    `,
  ],
})
export class ChatListComponent {
  readonly chatService = inject(ChatService);
  readonly authService = inject(AuthService);

  messages = input.required<MessageWithUser[]>();
  isSearching = input(false);
  messagesChanged = output<void>();

  @ViewChild('chatList') chatListElement!: ElementRef<HTMLDivElement>;

  constructor() {
    effect(() => {
      const messages = this.messages();
      setTimeout(() => this.scrollToBottom(), 100);
      this.messagesChanged.emit();
    });
  }

  private scrollToBottom(): void {
    if (this.chatListElement) {
      const element = this.chatListElement.nativeElement;
      element.scrollTop = element.scrollHeight;
    }
  }

  isOwnMessage(userId: string): boolean {
    const currentUser = this.authService.user();
    return currentUser?._id === userId;
  }

  getFullTime(timestamp: number): string {
    const date = new Date(timestamp);
    return date.toLocaleString();
  }
}
