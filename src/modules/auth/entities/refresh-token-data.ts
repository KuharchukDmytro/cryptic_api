import { RefreshToken } from '@prisma/client';

export interface RefreshTokenData
  extends Pick<RefreshToken, 'token' | 'userId' | 'id' | 'expiresAt'> {}
