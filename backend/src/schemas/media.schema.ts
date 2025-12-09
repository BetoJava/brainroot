
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true })
export class Media {
  @Prop({ required: true, unique: true })
  id: string; // ID de la vidéo YouTube

  @Prop({ required: true })
  url: string; // URL complète de la vidéo

  @Prop({ required: false })
  title?: string;

  @Prop({ required: false })
  description?: string;

  @Prop({ required: false })
  thumbnail?: string; // URL de la miniature

  @Prop({ required: false })
  duration?: string;

  @Prop({ required: false })
  transcription?: string;
}

export type MediaDocument = HydratedDocument<Media>;
export const MediaSchema = SchemaFactory.createForClass(Media);
