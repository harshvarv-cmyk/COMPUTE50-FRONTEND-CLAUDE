export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export type LoadingStateStatus = 'idle' | 'loading' | 'success' | 'error';

export interface NavLinkItem {
  label: string;
  path: string;
}
