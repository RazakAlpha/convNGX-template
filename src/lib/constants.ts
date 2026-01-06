export const PASSWORD = {
  MIN_LENGTH: 8,
  MAX_LENGTH: 128,
} as const;

export const EMAIL = {
  MAX_LENGTH: 254,
  REGEX: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
} as const;

export const NAME = {
  MIN_LENGTH: 2,
  MAX_LENGTH: 100,
} as const;

export const MESSAGE = {
  MIN_LENGTH: 1,
  MAX_LENGTH: 1000,
} as const;

export const AUTH = {
  TOKEN_EXPIRY_SKEW_MS: 45000,
  SESSION_REFRESH_THRESHOLD_MS: 60000,
} as const;

export const TOAST = {
  SUCCESS_DURATION: 5000,
  ERROR_DURATION: 8000,
  INFO_DURATION: 3000,
  WARNING_DURATION: 6000,
} as const;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 50,
  MAX_PAGE_SIZE: 100,
} as const;

export const DEBOUNCE = {
  SEARCH_MS: 300,
  INPUT_MS: 500,
} as const;

export const ROUTES = {
  HOME: '/',
  SIGN_IN: '/signin',
  SIGN_UP: '/signup',
  DASHBOARD: '/dashboard',
  CHAT: '/chat',
  PROFILE: '/profile',
  SETTINGS: '/settings',
} as const;
