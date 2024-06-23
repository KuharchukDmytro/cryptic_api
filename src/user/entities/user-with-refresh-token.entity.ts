import { RefreshToken, User } from '@prisma/client';

export type UserWithRefreshTokens = User & {
  refreshTokens?: RefreshToken[];
};
