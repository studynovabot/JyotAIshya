/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  constructor(message, statusCode, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Custom error class for AI service errors
 */
export class AiServiceError extends ApiError {
  constructor(message, provider, originalError = null) {
    super(message, 503); // Service Unavailable
    this.provider = provider;
    this.originalError = originalError;
  }
}

/**
 * Error handler middleware for Express
 */
export const errorHandlerMiddleware = (err, req, res, next) => {
  console.error('Error:', err);
  
  // Default error status and message
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let details = err.details || null;
  
  // Additional info for development environment
  const devInfo = process.env.NODE_ENV === 'development' 
    ? {
        stack: err.stack,
        originalError: err.originalError || null
      }
    : null;
  
  // Send the error response
  res.status(statusCode).json({
    success: false,
    message,
    details,
    ...(devInfo && { devInfo })
  });
};

/**
 * Async handler to catch errors in async route handlers
 * @param {Function} fn - The async route handler function
 * @returns {Function} - Express middleware function
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default {
  ApiError,
  AiServiceError,
  errorHandlerMiddleware,
  asyncHandler
};