import { auth } from '@/auth';
import { ForbiddenError, UnauthorizedError } from '@/lib/errors';

export interface AuthenticatedSession {
  user: {
    id: string;
    username?: string | null;
  };
}

export async function requireAuth(): Promise<AuthenticatedSession> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new UnauthorizedError();
  }
  return session as AuthenticatedSession;
}

export function assertResourceOwner(
  resourceAuthorId: string | null | undefined,
  userId: string,
): void {
  if (!resourceAuthorId || resourceAuthorId !== userId) {
    throw new ForbiddenError('You do not have access to this resource');
  }
}
