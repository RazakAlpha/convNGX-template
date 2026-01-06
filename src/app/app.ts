import { Component, signal, inject } from '@angular/core';
import { Router, RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { ToastNotificationComponent } from './shared/components/toast-notification.component';
import { ROUTES } from '../lib/constants';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, CommonModule, ToastNotificationComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('Chat App');
  private readonly router = inject(Router);

  constructor(public authService: AuthService) {}

  async signOut(): Promise<void> {
    try {
      await this.authService.signOut();
      this.router.navigate([ROUTES.SIGN_IN]);
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  }
}
