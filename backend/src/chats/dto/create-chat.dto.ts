import { IsString, IsOptional, IsArray } from 'class-validator';
import { Message } from 'src/schemas/chat.schema';

export class CreateChatDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  userId: string;

  @IsOptional()
  @IsArray()
  messages?: Message[];
}