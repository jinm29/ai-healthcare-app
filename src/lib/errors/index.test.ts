import { describe, expect, it } from 'vitest';
import { AppError, ForbiddenError, NotFoundError, UnauthorizedError } from '@/lib/errors';

describe('errors', () => {
  it('creates typed application errors with status codes', () => {
    expect(new UnauthorizedError().statusCode).toBe(401);
    expect(new ForbiddenError().statusCode).toBe(403);
    expect(new NotFoundError().statusCode).toBe(404);
    expect(new AppError('Server error', 500, 'INTERNAL').code).toBe('INTERNAL');
  });
});
