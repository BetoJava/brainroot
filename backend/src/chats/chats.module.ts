import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { OpenAIService } from './openai.service';
import { Chat, ChatSchema } from '../schemas/chat.schema';
import { Media, MediaSchema } from '../schemas/media.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Chat.name, schema: ChatSchema },
      { name: Media.name, schema: MediaSchema }
    ]),
  ],
  controllers: [ChatsController],
  providers: [ChatsService, OpenAIService],
})
export class ChatsModule {}
