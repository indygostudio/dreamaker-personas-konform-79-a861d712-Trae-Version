/**
 * Utility for standardized error handling across the application
 */

// Error severity levels
export enum ErrorSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical'
}

// Error source categories
export enum ErrorSource {
  API = 'api',
  DATABASE = 'database',
  STORAGE = 'storage',
  AUTH = 'auth',
  UI = 'ui',
  AUDIO = 'audio',
  MEDIA = 'media',
  UNKNOWN = 'unknown'
}

// Error context interface
export interface ErrorContext {
  source: ErrorSource;
  severity: ErrorSeverity;
  operation?: string;
  metadata?: Record<string, any>;
}

/**
 * Handle an error with standardized logging and optional reporting
 * @param error The error object
 * @param context Error context information
 * @param userMessage Optional user-friendly message
 */
export function handleError(
  error: unknown,
  context: ErrorContext,
  userMessage?: string
): void {
  // Extract error message
  const errorMessage = error instanceof Error 
    ? error.message 
    : String(error);

  // Create structured error log
  const errorLog = {
    timestamp: new Date().toISOString(),
    message: errorMessage,
    stack: error instanceof Error ? error.stack : undefined,
    ...context
  };

  // Log based on severity
  switch (context.severity) {
    case ErrorSeverity.INFO:
      console.info(`[${context.source}] ${errorMessage}`, errorLog);
      break;
    case ErrorSeverity.WARNING:
      console.warn(`[${context.source}] ${errorMessage}`, errorLog);
      break;
    case ErrorSeverity.ERROR:
      console.error(`[${context.source}] ${errorMessage}`, errorLog);
      break;
    case ErrorSeverity.CRITICAL:
      console.error(`[CRITICAL][${context.source}] ${errorMessage}`, errorLog);
      // Could add additional reporting for critical errors (e.g., to a monitoring service)
      break;
  }

  // In a production environment, you might want to send errors to a monitoring service
  // if (process.env.NODE_ENV === 'production' && context.severity >= ErrorSeverity.ERROR) {
  //   reportErrorToMonitoringService(errorLog);
  // }
}

/**
 * Create a wrapped version of a function with standardized error handling
 * @param fn Function to wrap with error handling
 * @param context Error context information
 * @param userMessage Optional user-friendly message
 * @returns Wrapped function with error handling
 */
export function withErrorHandling<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  context: ErrorContext,
  userMessage?: string
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  return async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    try {
      return await fn(...args);
    } catch (error) {
      handleError(error, context, userMessage);
      throw error;
    }
  };
}

/**
 * Try to execute a function and handle any errors
 * @param fn Function to execute
 * @param context Error context information
 * @param userMessage Optional user-friendly message
 * @returns Result of the function or null if an error occurred
 */
export async function tryCatch<T>(
  fn: () => Promise<T>,
  context: ErrorContext,
  userMessage?: string
): Promise<T | null> {
  try {
    return await fn();
  } catch (error) {
    handleError(error, context, userMessage);
    return null;
  }
}