import { IsString, IsArray, IsOptional, ValidateNested, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class AttachmentDto {
  @IsString()
  id: string;

  @IsString()
  @IsIn(['youtube-media', 'audio-file', 'image'])
  type: 'youtube-media' | 'audio-file' | 'image';

  @IsOptional()
  mediaData?: any;
}

export class SendMessageDto {
  @IsString()
  chatId: string;

  @IsString()
  message: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttachmentDto)
  @IsOptional()
  attachments?: AttachmentDto[];
}

