import "server-only"

/**
 * Log levels for structured logging
 */
enum LogLevel {
  DEBUG = "debug",
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
}

/**
 * Structured log entry
 */
interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  context?: Record<string, unknown>
  error?: {
    name: string
    message: string
    stack?: string
  }
}

/**
 * Logger class for structured, environment-aware logging
 * In development: Pretty console output
 * In production: Structured JSON for log aggregation services
 */
class Logger {
  private isDevelopment = process.env.NODE_ENV === "development"

  /**
   * Format log entry for output
   */
  private formatLog(entry: LogEntry): string {
    if (this.isDevelopment) {
      // Pretty format for development
      const contextStr = entry.context
        ? `\n  Context: ${JSON.stringify(entry.context, null, 2)}`
        : ""
      const errorStr = entry.error
        ? `\n  Error: ${entry.error.message}\n  Stack: ${entry.error.stack}`
        : ""
      return `[${entry.timestamp}] ${entry.level.toUpperCase()}: ${entry.message}${contextStr}${errorStr}`
    } else {
      // JSON format for production (easy to parse by log aggregation tools)
      return JSON.stringify(entry)
    }
  }

  /**
   * Create log entry
   */
  private createEntry(
    level: LogLevel,
    message: string,
    context?: Record<string, unknown>,
    error?: Error
  ): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      error: error
        ? {
            name: error.name,
            message: error.message,
            stack: error.stack,
          }
        : undefined,
    }
  }

  /**
   * Log debug message (only in development)
   */
  debug(message: string, context?: Record<string, unknown>) {
    if (this.isDevelopment) {
      const entry = this.createEntry(LogLevel.DEBUG, message, context)
      console.debug(this.formatLog(entry))
    }
  }

  /**
   * Log info message
   */
  info(message: string, context?: Record<string, unknown>) {
    const entry = this.createEntry(LogLevel.INFO, message, context)
    console.info(this.formatLog(entry))
  }

  /**
   * Log warning message
   */
  warn(message: string, context?: Record<string, unknown>) {
    const entry = this.createEntry(LogLevel.WARN, message, context)
    console.warn(this.formatLog(entry))
  }

  /**
   * Log error message
   */
  error(
    message: string,
    error?: Error | unknown,
    context?: Record<string, unknown>
  ) {
    const errorObj = error instanceof Error ? error : undefined
    const entry = this.createEntry(LogLevel.ERROR, message, context, errorObj)
    console.error(this.formatLog(entry))

    // In production, you could send to external service here
    // Example: Sentry.captureException(error)
  }
}

/**
 * Singleton logger instance
 * Usage:
 *   logger.info("User logged in", { userId: "123" })
 *   logger.error("Failed to create post", error, { postId: "abc" })
 */
const logger = new Logger()

/**
 * Helper to create context-specific loggers
 * Usage:
 *   const log = createLogger("PostActions")
 *   log.error("Failed to create post", error)
 */
export function createLogger(module: string) {
  return {
    debug: (message: string, context?: Record<string, unknown>) =>
      logger.debug(message, { module, ...context }),
    info: (message: string, context?: Record<string, unknown>) =>
      logger.info(message, { module, ...context }),
    warn: (message: string, context?: Record<string, unknown>) =>
      logger.warn(message, { module, ...context }),
    error: (
      message: string,
      error?: Error | unknown,
      context?: Record<string, unknown>
    ) => logger.error(message, error, { module, ...context }),
  }
}
