import { Conversation, Media, Message, User } from '@prisma/client';

export type MessageWithRelations = Message & {
  sender: User;
  media: Media[];
  conversation: Conversation & {
    participants: User[];
  };
};
