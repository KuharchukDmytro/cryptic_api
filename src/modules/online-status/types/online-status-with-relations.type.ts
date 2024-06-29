import { OnlineStatus, User } from '@prisma/client';

export type OnlineStatusWithRelations = OnlineStatus & {
  user: User;
};
