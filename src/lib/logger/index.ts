export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

function resolveMinLevel(): LogLevel {
  const configured = process.env.LOG_LEVEL?.toLowerCase();
  if (configured && configured in LOG_LEVELS) {
    return configured as LogLevel;
  }
  return process.env.NODE_ENV === 'production' ? 'info' : 'debug';
}

let minLevel = resolveMinLevel();

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[minLevel];
}

function formatMessage(level: LogLevel, message: string, context?: Record<string, unknown>): string {
  const payload = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...(context ? { context } : {}),
  };
  return JSON.stringify(payload);
}

export const logger = {
  setLevel(level: LogLevel): void {
    minLevel = level;
  },

  debug(message: string, context?: Record<string, unknown>): void {
    if (shouldLog('debug')) {
      console.debug(formatMessage('debug', message, context));
    }
  },

  info(message: string, context?: Record<string, unknown>): void {
    if (shouldLog('info')) {
      console.info(formatMessage('info', message, context));
    }
  },

  warn(message: string, context?: Record<string, unknown>): void {
    if (shouldLog('warn')) {
      console.warn(formatMessage('warn', message, context));
    }
  },

  error(message: string, context?: Record<string, unknown>): void {
    if (shouldLog('error')) {
      console.error(formatMessage('error', message, context));
    }
  },
};
