import { ApiResponse, ApiSuccess, ApiError } from "../models/types";

// ============================================================================
// Response Formatter Utilities
// ============================================================================

/**
 * Format a successful API response
 */
export function successResponse<T>(data: T): ApiSuccess<T> {
  return {
    success: true,
    data,
  };
}

/**
 * Format an error API response
 */
export function errorResponse(
  error: string | Error,
  code?: string,
  details?: Record<string, unknown>
): ApiError {
  const message = typeof error === "string" ? error : error.message;
  return {
    success: false,
    error: message,
    code: code || "INTERNAL_ERROR",
    details,
  };
}

/**
 * Type guard for successful response
 */
export function isSuccess<T>(response: ApiResponse<T>): response is ApiSuccess<T> {
  return response.success === true;
}

/**
 * Type guard for error response
 */
export function isError<T>(response: ApiResponse<T>): response is ApiError {
  return response.success === false;
}

// ============================================================================
// HTTP Status Code Helpers
// ============================================================================

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

export function getHttpStatus(errorCode?: string): number {
  switch (errorCode) {
    case "VALIDATION_ERROR":
      return HTTP_STATUS.BAD_REQUEST;
    case "UNAUTHORIZED":
      return HTTP_STATUS.UNAUTHORIZED;
    case "FORBIDDEN":
      return HTTP_STATUS.FORBIDDEN;
    case "NOT_FOUND":
      return HTTP_STATUS.NOT_FOUND;
    case "CONFLICT":
      return HTTP_STATUS.CONFLICT;
    case "UNPROCESSABLE_ENTITY":
      return HTTP_STATUS.UNPROCESSABLE_ENTITY;
    case "SERVICE_UNAVAILABLE":
      return HTTP_STATUS.SERVICE_UNAVAILABLE;
    default:
      return HTTP_STATUS.INTERNAL_SERVER_ERROR;
  }
}
