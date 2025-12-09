import { Controller, Post, Body } from '@nestjs/common';
import { YoutubeService } from './youtube.service';
import { MediaDocument } from '../schemas/media.schema';

export class GetVideoMetadataDto {
  url: string;
}

export class GetVideoTranscriptionDto {
  url: string;
}

@Controller('youtube')
export class YoutubeController {
  constructor(private readonly youtubeService: YoutubeService) {}

  @Post('metadata')
  async getVideoMetadata(@Body() dto: GetVideoMetadataDto): Promise<MediaDocument> {
    return this.youtubeService.getVideoMetadata(dto.url);
  }

  @Post('transcription')
  async getVideoTranscription(@Body() dto: GetVideoTranscriptionDto): Promise<MediaDocument> {
    const media = await this.youtubeService.getVideoTranscription(dto.url);
    console.log('Media');
    return media;
  }
}
