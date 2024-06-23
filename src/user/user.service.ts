import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { UserWithRefreshTokens } from './entities/user-with-refresh-token.entity';

@Injectable()
export class UserService {
  constructor(private databaseService: DatabaseService) {}

  async create(options: Prisma.UserCreateArgs) {
    return this.databaseService.user.create(options);
  }

  async getByUsernameOrEmail(
    { email = '', username = '' },
    options?: Prisma.UserFindFirstArgs,
  ): Promise<UserWithRefreshTokens | null> {
    return this.databaseService.user.findFirst({
      ...options,
      where: {
        OR: [
          {
            username,
          },
          {
            email,
          },
        ],
      },
    });
  }

  async update(options: Prisma.UserUpdateArgs) {
    return this.databaseService.user.update(options);
  }
}
