import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { Chat, ChatDocument, Message } from '../schemas/chat.schema';
import { Media, MediaDocument } from '../schemas/media.schema';

@Injectable()
export class ChatsService {
  constructor(
    @InjectModel(Chat.name) private chatModel: Model<ChatDocument>,
    @InjectModel(Media.name) private mediaModel: Model<MediaDocument>,
  ) { }

  async create(createChatDto: CreateChatDto) {
    const createdChat = new this.chatModel(createChatDto);
    return createdChat.save();
  }

  async findAll() {
    const chats = await this.chatModel.find().exec();
    return this.enrichChatsWithMedia(chats);
  }

  async findOne(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid chat ID format: ${id}`);
    }
    const chat = await this.chatModel.findById(id).exec();
    if (!chat) {
      throw new NotFoundException(`Chat with ID ${id} not found`);
    }
    const enrichedChats = await this.enrichChatsWithMedia([chat]);
    return enrichedChats[0];
  }

  async update(id: string, updateChatDto: UpdateChatDto) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid chat ID format: ${id}`);
    }
    return this.chatModel.findByIdAndUpdate(id, updateChatDto, { new: true }).exec();
  }

  async remove(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid chat ID format: ${id}`);
    }
    return this.chatModel.findByIdAndDelete(id).exec();
  }

  async addMessage(chatId: string, message: Message) {
    if (!Types.ObjectId.isValid(chatId)) {
      throw new BadRequestException(`Invalid chat ID format: ${chatId}`);
    }
    const chat = await this.chatModel.findById(chatId).exec();
    if (!chat) {
      throw new NotFoundException(`Chat with ID ${chatId} not found`);
    }
    chat.messages.push(message);
    return chat.save();
  }

  async addMessages(chatId: string, messages: Message[]) {
    if (!Types.ObjectId.isValid(chatId)) {
      throw new BadRequestException(`Invalid chat ID format: ${chatId}`);
    }
    const chat = await this.chatModel.findById(chatId).exec();
    if (!chat) {
      throw new NotFoundException(`Chat with ID ${chatId} not found`);
    }
    chat.messages.push(...messages);
    return chat.save();
  }

  async getMessages(chatId: string): Promise<Message[]> {
    if (!Types.ObjectId.isValid(chatId)) {
      throw new BadRequestException(`Invalid chat ID format: ${chatId}`);
    }
    const chat = await this.chatModel.findById(chatId).exec();
    if (!chat) {
      throw new NotFoundException(`Chat with ID ${chatId} not found`);
    }
    return chat.messages;
  }

  async getProcessedMessages(chatId: string): Promise<Message[]> {
    const messages = await this.getMessages(chatId);
    for (const message of messages) {
      if (message.attachments.length > 0) {
        for (const attachment of message.attachments) {
          if (attachment.type === 'youtube-media') {
            if (attachment.mediaData) {
              const titleMessage = attachment.mediaData.title ? `Titre: ${attachment.mediaData.title}\n` : '';
              const descriptionMessage = attachment.mediaData.description ? `Description: ${attachment.mediaData.description}\n` : '';
              const transcriptionMessage = attachment.mediaData.transcription ? `Transcription: ${attachment.mediaData.transcription}\n` : '';
              message.content = `Vidéo Youtube ajoutée:\n${titleMessage}${descriptionMessage}${transcriptionMessage}\n---\nMessage:\n${message.content}`;
            }
          }
        }
      }
    }
    return messages;
  }

  private async enrichChatsWithMedia(chats: ChatDocument[]): Promise<any[]> {
    // Collecter tous les IDs de médias de tous les chats
    const mediaIds = new Set<string>();
    chats.forEach(chat => {
      chat.messages.forEach(message => {
        message.attachments.forEach(attachment => {
          if (attachment.type === 'youtube-media') {
            mediaIds.add(attachment.id);
          }
        });
      });
    });

    // Récupérer tous les médias en une seule requête
    const mediaMap = new Map<string, MediaDocument>();
    if (mediaIds.size > 0) {
      const mediaList = await this.mediaModel.find({ id: { $in: Array.from(mediaIds) } }).exec();
      mediaList.forEach(media => {
        mediaMap.set(media.id, media);
      });
    }

    // Enrichir les chats avec les données des médias
    return chats.map(chat => {
      const enrichedChat = chat.toObject();
      enrichedChat.messages = enrichedChat.messages.map(message => {
        return {
          ...message,
          attachments: message.attachments.map(attachment => {
            if (attachment.type === 'youtube-media' && mediaMap.has(attachment.id)) {
              return {
                ...attachment,
                mediaData: mediaMap.get(attachment.id)
              };
            }
            return attachment;
          })
        };
      });
      return enrichedChat;
    });
  }
}
