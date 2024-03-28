import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateUserDto } from './dtos/createUser.dto';

@Injectable()
export class UserService {
  constructor(private readonly databaseService: DatabaseService) {}

  async createUser(data: CreateUserDto) {
    return this.databaseService.user.create({ data });
  }
}
