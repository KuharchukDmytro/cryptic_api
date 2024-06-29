import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class ConversationService {
  constructor(private readonly database: DatabaseService) {}

  create(options: Prisma.ConversationCreateArgs) {
    return this.database.conversation.create(options);
  }

  findAll(options: Prisma.ConversationFindManyArgs) {
    return this.database.conversation.findMany(options);
  }

  findOne(options: Prisma.ConversationFindFirstArgs) {
    return this.database.conversation.findFirst(options);
  }

  update(options: Prisma.ConversationUpdateArgs) {
    return this.database.conversation.update(options);
  }

  remove(options: Prisma.ConversationDeleteArgs) {
    return this.database.conversation.delete(options);
  }
}
