import { Request } from 'express';

declare module 'express' {
  export interface RequestWithUser extends Request {
    currentUserId: number;
    currentUserUsername: string;
    currentUserEmail: string;
  }
}
