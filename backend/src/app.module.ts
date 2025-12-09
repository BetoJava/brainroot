import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { ChatsModule } from './chats/chats.module';
import { DatabaseModule } from './database/database.module';
import { YoutubeModule } from './youtube/youtube.module';
import { TranscribeModule } from './transcribe/transcribe.module';

@Module({
  imports: [ConfigModule, DatabaseModule, ChatsModule, YoutubeModule, TranscribeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
