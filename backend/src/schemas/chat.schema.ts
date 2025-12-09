
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MessageRole = 'user' | 'assistant' | 'system';
export type AttachmentType = 'youtube-media' | 'audio-file' | 'image';

@Schema({ _id: false })
export class Attachment {
  @Prop({ required: true })
  id: string; // ID du MediaDocument ou autre ressource

  @Prop({ required: true, enum: ['youtube-media', 'audio-file', 'image'] })
  type: AttachmentType;

  @Prop({ required: false, type: Object })
  mediaData?: any;
}

export const AttachmentSchema = SchemaFactory.createForClass(Attachment);

@Schema({ _id: false })
export class Message {
  @Prop({ required: true, enum: ['user', 'assistant', 'system'] })
  role: MessageRole;

  @Prop({ required: true })
  content: string;

  @Prop({ type: [AttachmentSchema], default: [] })
  attachments: Attachment[];

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);

@Schema({ timestamps: true })
export class Chat {
  @Prop({ required: true })
  name: string;

  // @Prop({ required: true })
  @Prop({ required: false })
  userId: string;

  @Prop({ type: [MessageSchema], default: [] })
  messages: Message[];
}

export type ChatDocument = HydratedDocument<Chat>;
export const ChatSchema = SchemaFactory.createForClass(Chat);