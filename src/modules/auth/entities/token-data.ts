import { User } from '@prisma/client';

export interface TokenData extends Pick<User, 'username' | 'id' | 'email'> {}
