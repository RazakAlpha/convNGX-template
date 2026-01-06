import {
  Component,
  input,
  output,
  signal,
  computed,
  inject,
  ElementRef,
  AfterViewInit,
  ViewChild,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MESSAGE } from '../../lib/constants';

@Component({
  selector: 'app-chat-input',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <div class="chat-input-container" [class.disabled]="disabled()">
      <div class="input-wrapper" [class.focused]="isFocused()">
        <textarea
          #messageInput
          [rows]="rows()"
          [disabled]="disabled()"
          [placeholder]="placeholder()"
          [value]="messageText()"
          (input)="handleInput($event)"
          (keydown)="handleKeydown($event)"
          (focus)="isFocused.set(true)"
          (blur)="isFocused.set(false)"
          class="message-textarea"
          [attr.aria-label]="placeholder()"
          [attr.aria-invalid]="isInvalid()"
        ></textarea>

        <div class="input-actions">
          <span
            class="character-count"
            [class.warning]="isNearLimit()"
            [class.error]="isAtLimit()"
          >
            {{ characterCount() }}/{{ maxCharacters() }}
          </span>

          <button
            type="button"
            class="send-button"
            [disabled]="disabled() || !isValid()"
            (click)="handleSendMessage()"
            [attr.aria-label]="sendButtonText()"
          >
            @if (isSending()) {
              <span class="spinner"></span>
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
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            }
          </button>
        </div>
      </div>

      @if (isInvalid()) {
        <div class="validation-error" role="alert">
          @if (messageText().trim().length === 0) {
            Message cannot be empty
          } @else if (characterCount() > maxCharacters()) {
            Message exceeds maximum length
          }
        </div>
      }
    </div>
  `,
  styles: [
    `
      .chat-input-container {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .chat-input-container.disabled {
        opacity: 0.5;
        pointer-events: none;
      }

      .input-wrapper {
        display: flex;
        gap: 0.75rem;
        background: var(--color-surface-elevated);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-xl);
        padding: 0.75rem;
        transition: all var(--transition-normal);
      }

      .input-wrapper:hover {
        border-color: var(--color-border-hover);
      }

      .input-wrapper.focused {
        border-color: var(--color-primary);
        box-shadow: 0 0 0 3px var(--color-primary-light);
      }

      .message-textarea {
        flex: 1;
        border: none;
        outline: none;
        resize: none;
        font-size: 0.9375rem;
        line-height: 1.5;
        font-family: inherit;
        background: transparent;
        color: var(--color-text-primary);
        min-height: 24px;
        max-height: 120px;
      }

      .message-textarea::placeholder {
        color: var(--color-text-muted);
      }

      .message-textarea:disabled {
        cursor: not-allowed;
      }

      .input-actions {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        justify-content: flex-end;
        gap: 0.5rem;
      }

      .character-count {
        font-size: 0.75rem;
        color: var(--color-text-muted);
        font-variant-numeric: tabular-nums;
      }

      .character-count.warning {
        color: var(--color-warning);
      }

      .character-count.error {
        color: var(--color-error);
      }

      .send-button {
        width: 40px;
        height: 40px;
        background: var(--gradient-primary);
        color: #fff;
        border: none;
        border-radius: var(--radius-lg);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all var(--transition-normal);
        box-shadow: var(--shadow-glow-primary);
      }

      .send-button:hover:not(:disabled) {
        transform: scale(1.05);
        box-shadow: 0 0 30px rgba(99, 102, 241, 0.5);
      }

      .send-button:active:not(:disabled) {
        transform: scale(0.98);
      }

      .send-button:disabled {
        background: var(--color-surface);
        color: var(--color-text-muted);
        box-shadow: none;
        cursor: not-allowed;
      }

      .spinner {
        width: 16px;
        height: 16px;
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

      .validation-error {
        font-size: 0.8125rem;
        color: var(--color-error);
        padding-left: 0.5rem;
      }

      @media (max-width: 640px) {
        .input-wrapper {
          padding: 0.625rem;
        }

        .message-textarea {
          font-size: 1rem;
        }

        .character-count {
          font-size: 0.6875rem;
        }

        .send-button {
          width: 36px;
          height: 36px;
        }
      }
    `,
  ],
})
export class ChatInputComponent implements AfterViewInit {
  disabled = input(false);
  placeholder = input('Type a message...');
  maxCharacters = input(MESSAGE.MAX_LENGTH);
  sendOnEnter = input(true);

  messageSubmit = output<string>();
  messageSent = output<void>();

  readonly messageText = signal('');
  readonly isSending = signal(false);
  readonly rows = signal(1);
  readonly isFocused = signal(false);

  readonly characterCount = computed(() => this.messageText().length);
  readonly isValid = computed(() => {
    const text = this.messageText().trim();
    return text.length >= MESSAGE.MIN_LENGTH && text.length <= this.maxCharacters();
  });
  readonly isInvalid = computed(() => {
    const text = this.messageText().trim();
    return (
      text.length > 0 && (text.length < MESSAGE.MIN_LENGTH || text.length > this.maxCharacters())
    );
  });
  readonly isNearLimit = computed(() => {
    const count = this.characterCount();
    const limit = this.maxCharacters();
    return count >= limit * 0.9 && count < limit;
  });
  readonly isAtLimit = computed(() => this.characterCount() >= this.maxCharacters());

  @ViewChild('messageInput') messageInputRef!: ElementRef<HTMLTextAreaElement>;

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.messageInputRef?.nativeElement) {
        this.messageInputRef.nativeElement.focus();
      }
    }, 100);
  }

  handleInput(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    this.messageText.set(textarea.value);
    this.adjustRows(textarea);
  }

  handleKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Enter') {
      return;
    }

    if (!this.sendOnEnter()) {
      return;
    }

    if (event.shiftKey) {
      return;
    }

    if (this.isValid()) {
      event.preventDefault();
      this.handleSendMessage();
    }
  }

  handleSendMessage(): void {
    if (!this.isValid() || this.disabled() || this.isSending()) {
      return;
    }

    const text = this.messageText().trim();
    if (!text) {
      return;
    }

    this.isSending.set(true);
    this.messageSubmit.emit(text);
    this.messageSent.emit();

    setTimeout(() => {
      this.isSending.set(false);
      this.messageText.set('');
      this.rows.set(1);
      if (this.messageInputRef?.nativeElement) {
        this.messageInputRef.nativeElement.focus();
      }
    }, 300);
  }

  private adjustRows(textarea: HTMLTextAreaElement): void {
    textarea.style.height = 'auto';
    const newHeight = Math.min(textarea.scrollHeight, 120);
    textarea.style.height = `${newHeight}px`;

    const newRows = Math.max(1, Math.ceil(newHeight / 24));
    this.rows.set(newRows);
  }

  sendButtonText(): string {
    return this.isSending() ? 'Sending...' : 'Send';
  }
}
