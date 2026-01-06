export const AUTH_ERROR_MESSAGES: Record<string, string> = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  EMAIL_ALREADY_EXISTS: 'An account with this email already exists',
  USER_NOT_FOUND: 'User not found',
  UNAUTHORIZED: 'You must be signed in to perform this action',
  INVALID_PASSWORD: 'Invalid password',
  PASSWORD_TOO_WEAK:
    'Password must contain at least 8 characters, including uppercase, lowercase, numbers, and special characters',
  EMAIL_NOT_VERIFIED: 'Please verify your email address',
  SESSION_EXPIRED: 'Your session has expired. Please sign in again',
  TOO_MANY_ATTEMPTS: 'Too many attempts. Please try again later',
  NETWORK_ERROR: 'Network error. Please check your connection and try again',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again',
};

export const formatErrorMessage = (error: unknown): string => {
  if (typeof error === 'string') {
    return error;
  }

  if (error instanceof Error) {
    const message = error.message;

    for (const [key, value] of Object.entries(AUTH_ERROR_MESSAGES)) {
      if (message.includes(key) || message.includes(value)) {
        return value;
      }
    }

    return message || AUTH_ERROR_MESSAGES['UNKNOWN_ERROR'];
  }

  return AUTH_ERROR_MESSAGES['UNKNOWN_ERROR'];
};

export const handleAuthError = (error: unknown): string => {
  const errorMessage = formatErrorMessage(error);

  if (errorMessage === AUTH_ERROR_MESSAGES['NETWORK_ERROR']) {
    return 'Unable to connect to the server. Please check your internet connection.';
  }

  return errorMessage;
};

export const isAuthError = (error: unknown): boolean => {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return (
      message.includes('auth') ||
      message.includes('unauthorized') ||
      message.includes('forbidden') ||
      message.includes('session') ||
      message.includes('credential') ||
      message.includes('sign in') ||
      message.includes('sign up')
    );
  }
  return false;
};

export const isNetworkError = (error: unknown): boolean => {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return (
      message.includes('network') ||
      message.includes('fetch') ||
      message.includes('timeout') ||
      message.includes('connection')
    );
  }
  return false;
};

export const isValidationError = (error: unknown): boolean => {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return (
      message.includes('validation') ||
      message.includes('invalid') ||
      message.includes('required') ||
      message.includes('format')
    );
  }
  return false;
};
