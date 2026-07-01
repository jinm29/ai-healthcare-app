import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number = 500,
    public readonly code?: string,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401, 'UNAUTHORIZED');
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 403, 'FORBIDDEN');
    this.name = 'ForbiddenError';
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Not found') {
    super(message, 404, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

export function handleApiError(error: unknown): NextResponse {
  if (error instanceof AppError) {
    logger.warn('API error', {
      code: error.code,
      message: error.message,
      statusCode: error.statusCode,
    });
    return NextResponse.json(
      { error: error.message, code: error.code },
      { status: error.statusCode },
    );
  }

  logger.error('Unhandled API error', {
    message: error instanceof Error ? error.message : 'Unknown error',
  });

  return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return 'Unknown error';
}
