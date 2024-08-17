import { RefreshToken, User } from '@prisma/client';

export type RefreshTokenWithRelations = RefreshToken & {
  user: User;
};
