type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogData {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
}

class Logger {
  private formatLog(level: LogLevel, message: string, context?: Record<string, unknown>): LogData {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
    };
  }

  private shouldLog(level: LogLevel): boolean {
    if (process.env.NODE_ENV === 'test') return false;
    if (process.env.NODE_ENV === 'production' && level === 'debug') return false;
    return true;
  }

  info(message: string, context?: Record<string, unknown>): void {
    if (this.shouldLog('info')) {
      console.log(JSON.stringify(this.formatLog('info', message, context)));
    }
  }

  warn(message: string, context?: Record<string, unknown>): void {
    if (this.shouldLog('warn')) {
      console.warn(JSON.stringify(this.formatLog('warn', message, context)));
    }
  }

  error(message: string, error?: Error, context?: Record<string, unknown>): void {
    if (this.shouldLog('error')) {
      console.error(
        JSON.stringify(
          this.formatLog('error', message, {
            ...context,
            error: error
              ? {
                  message: error.message,
                  stack: error.stack,
                  name: error.name,
                }
              : undefined,
          })
        )
      );
    }
  }

  debug(message: string, context?: Record<string, unknown>): void {
    if (this.shouldLog('debug')) {
      console.debug(JSON.stringify(this.formatLog('debug', message, context)));
    }
  }
}

export const logger = new Logger();

