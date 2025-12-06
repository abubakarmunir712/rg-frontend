export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  error: string;
  code: string;
}

export interface AppError {
  type: 'validation' | 'network' | 'auth' | 'rate-limit' | 'server';
  message: string;
  code?: string;
  field?: string; // For validation errors
}
