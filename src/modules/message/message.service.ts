import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class MessageService {
  constructor(private readonly database: DatabaseService) {}

  create(options: Prisma.MessageCreateArgs) {
    return this.database.message.create(options);
  }

  findAll(options: Prisma.MessageFindManyArgs) {
    return this.database.message.findMany(options);
  }

  findOne(options: Prisma.MessageFindFirstArgs) {
    return this.database.message.findFirst(options);
  }

  update(options: Prisma.MessageUpdateArgs) {
    return this.database.message.update(options);
  }

  remove(options: Prisma.MessageDeleteManyArgs) {
    return this.database.message.deleteMany(options);
  }
}
