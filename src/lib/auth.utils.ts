export interface AuthError extends Error {
  code?: string;
  status?: number;
}

export const isAuthError = (error: unknown): error is AuthError => {
  return (
    error instanceof Error &&
    'code' in error &&
    (error as AuthError).code !== undefined
  );
};

export const getAuthErrorMessage = (error: unknown): string => {
  if (isAuthError(error)) {
    switch (error.code) {
      case 'INVALID_CREDENTIALS':
        return 'Invalid email or password';
      case 'EMAIL_ALREADY_EXISTS':
        return 'An account with this email already exists';
      case 'USER_NOT_FOUND':
        return 'User not found';
      case 'UNAUTHORIZED':
        return 'You must be signed in to perform this action';
      case 'INVALID_PASSWORD':
        return 'Invalid password';
      case 'PASSWORD_TOO_WEAK':
        return 'Password must contain at least 8 characters, including uppercase, lowercase, numbers, and special characters';
      case 'EMAIL_NOT_VERIFIED':
        return 'Please verify your email address';
      case 'SESSION_EXPIRED':
        return 'Your session has expired. Please sign in again';
      case 'TOO_MANY_ATTEMPTS':
        return 'Too many attempts. Please try again later';
      default:
        return error.message || 'An authentication error occurred';
    }
  }

  if (error instanceof Error) {
    return error.message || 'An unexpected error occurred';
  }

  return 'An unexpected error occurred';
};

export const getTokenExpiry = (token: string): number => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000;
  } catch {
    return 0;
  }
};

export const isTokenExpired = (token: string, skewMs: number = 0): boolean => {
  const expiry = getTokenExpiry(token);
  if (!expiry) return true;
  return Date.now() + skewMs >= expiry;
};

export const getTimeUntilExpiry = (token: string): number => {
  const expiry = getTokenExpiry(token);
  if (!expiry) return 0;
  return Math.max(0, expiry - Date.now());
};

export const formatTimeRemaining = (ms: number): string => {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);

  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }
  return `${seconds}s`;
};

export const getInitials = (name: string): string => {
  const parts = name.trim().split(' ');
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

export const getDisplayName = (name?: string | null, email?: string | null): string => {
  if (name) return name;
  if (email) return email.split('@')[0];
  return 'User';
};

export const isValidEmail = (email: string): boolean => {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/\s+/g, ' ');
};

export const generateRandomId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};
