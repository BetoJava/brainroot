import { Module } from '@nestjs/common';
import { TranscribeService } from './transcribe.service';
import { TranscribeController } from './transcribe.controller';
import { ConfigModule } from '../config/config.module';

@Module({
  imports: [ConfigModule],
  controllers: [TranscribeController],
  providers: [TranscribeService],
  exports: [TranscribeService],
})
export class TranscribeModule {}
