import { Injectable, computed, inject, signal } from '@angular/core';
import { CONVEX, convexLiveResource, type ConvexAngularClient } from '@razakalpha/convngx';
import { api } from '../../convex/_generated/api';
import { MESSAGE } from '../../lib/constants';
import { formatErrorMessage } from '../../lib/error-handler';

export interface MessageWithUser {
  user?: {
    _id: string;
    email: string;
    name: string;
    _creationTime: number;
  };
  message: {
    _id: string;
    _creationTime: number;
    userId: string;
    content: string;
    createdAt: number;
  };
}

@Injectable({ providedIn: 'root' })
export class ChatService {
  private readonly convex = inject<ConvexAngularClient>(CONVEX);

  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);

  private readonly messagesResource = convexLiveResource(
    api.messages.getMessages,
    () => ({}),
    { keep: 'last' },
  );

  readonly messages = computed(() => this.messagesResource.value() ?? []);
  readonly isLoadingMessages = computed(() => this.messagesResource.isLoading() ?? false);

  private searchResults = signal<MessageWithUser[]>([]);
  private _isSearching = signal(false);

  readonly hasError = computed(() => this.error() !== null);
  readonly isSearchActive = computed(() => this._isSearching());

  async sendMessage(content: string): Promise<void> {
    this.error.set(null);
    this.isLoading.set(true);

    try {
      const trimmedContent = content.trim();

      if (!trimmedContent) {
        throw new Error('Message cannot be empty');
      }

      if (trimmedContent.length > MESSAGE.MAX_LENGTH) {
        throw new Error(`Message cannot exceed ${MESSAGE.MAX_LENGTH} characters`);
      }

      await this.convex.mutation(api.messages.sendMessage, { content: trimmedContent });
    } catch (e: unknown) {
      const errorMessage = formatErrorMessage(e);
      this.error.set(errorMessage);
      throw new Error(errorMessage);
    } finally {
      this.isLoading.set(false);
    }
  }

  async searchMessages(content: string): Promise<void> {
    this.error.set(null);
    this._isSearching.set(true);

    try {
      if (!content.trim()) {
        this.searchResults.set([]);
        return;
      }

      const results = await this.convex.query(api.messages.getFilteredMessagesByContent, {
        content,
      });
      this.searchResults.set(results);
    } catch (e: unknown) {
      const errorMessage = formatErrorMessage(e);
      this.error.set(errorMessage);
      throw new Error(errorMessage);
    } finally {
      this._isSearching.set(false);
    }
  }

  clearSearch(): void {
    this.searchResults.set([]);
    this._isSearching.set(false);
  }

  get displayMessages(): MessageWithUser[] {
    if (this._isSearching()) {
      return this.searchResults();
    }
    return this.messages();
  }

  getUserInitials(name?: string | null, email?: string | null): string {
    if (name) {
      const parts = name.trim().split(' ');
      if (parts.length === 1) {
        return parts[0].charAt(0).toUpperCase();
      }
      return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    }

    if (email) {
      return email.charAt(0).toUpperCase();
    }

    return 'U';
  }

  getDisplayName(name?: string | null, email?: string | null): string {
    if (name) return name;
    if (email) return email.split('@')[0];
    return 'Anonymous';
  }

  formatTime(timestamp: number): string {
    const now = Date.now();
    const diff = now - timestamp;

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) {
      return 'just now';
    }

    if (minutes < 60) {
      return `${minutes}m ago`;
    }

    if (hours < 24) {
      return `${hours}h ago`;
    }

    if (days < 7) {
      return `${days}d ago`;
    }

    const date = new Date(timestamp);
    return date.toLocaleDateString();
  }

  clearError(): void {
    this.error.set(null);
  }
}
