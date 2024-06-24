import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class OnlineStatusService {
  constructor(private readonly database: DatabaseService) {}

  create(createOnlineStatusInput: Prisma.OnlineStatusCreateArgs) {
    return this.database.onlineStatus.create(createOnlineStatusInput);
  }

  findAll(findAllOnlineStatusInput: Prisma.OnlineStatusFindManyArgs) {
    return this.database.onlineStatus.findMany(findAllOnlineStatusInput);
  }

  findOne(findFirstOnlineStatusInput: Prisma.OnlineStatusFindFirstArgs) {
    return this.database.onlineStatus.findFirst(findFirstOnlineStatusInput);
  }

  update(updateOnlineStatusInput: Prisma.OnlineStatusUpdateArgs) {
    return this.database.onlineStatus.update(updateOnlineStatusInput);
  }

  remove(id: number) {
    return this.database.onlineStatus.delete({
      where: { id },
    });
  }
}
