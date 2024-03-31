import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class UserService {
  constructor(private databaseService: DatabaseService) {}

  async create(options: Prisma.UserCreateArgs) {
    return this.databaseService.user.create(options);
  }

  async getByUsernameOrEmail(
    { email = '', username = '' },
    options?: Prisma.UserCreateArgs,
  ): Promise<User | null> {
    return this.databaseService.user.findFirst({
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
      select: options?.select || undefined,
    });
  }

  async update(id: number, options: Omit<Prisma.UserUpdateArgs, 'where'>) {
    return this.databaseService.user.update({
      ...options,
      where: {
        id,
      },
    });
  }
}
