
/**
 * Generic API Response structure.
 */
export interface ApiResponse<T> {
  data: T;
  message?: string;
  statusCode: number;
  success: boolean;
  timestamp: string;
}

/**
 * Error Response structure.
 */
export interface ApiErrorResponse {
  message: string;
  statusCode: number;
  error?: string;
  timestamp: string;
}

