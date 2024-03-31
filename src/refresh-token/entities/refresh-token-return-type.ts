import { RefreshToken } from '@prisma/client';

export interface RefreshTokenReturnType
  extends Omit<RefreshToken, 'expiresAt'> {
  expiresAt: string;
}
