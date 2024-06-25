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

  findOne(id: number) {
    return `This action returns a #${id} conversation`;
  }

  update(id: number) {
    return `This action updates a #${id} conversation`;
  }

  remove(id: number) {
    return `This action removes a #${id} conversation`;
  }
}
