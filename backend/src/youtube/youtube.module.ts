import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { YoutubeService } from './youtube.service';
import { YoutubeController } from './youtube.controller';
import { ConfigModule } from '../config/config.module';
import { TranscribeModule } from '../transcribe/transcribe.module';
import { Media, MediaSchema } from '../schemas/media.schema';

@Module({
  imports: [
    ConfigModule, 
    TranscribeModule,
    MongooseModule.forFeature([
      { name: Media.name, schema: MediaSchema },
    ])
  ],
  controllers: [YoutubeController],
  providers: [YoutubeService],
})
export class YoutubeModule {}
