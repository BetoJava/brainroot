export type MessageRole = 'user' | 'assistant' | 'system';

export type AttachmentType = 'youtube-media' | 'audio-file' | 'image';

export interface Attachment {
  id: string;
  type: AttachmentType;
  mediaData?: any;
}

export interface Message {
  role: MessageRole;
  content: string;
  createdAt: Date;
  attachments: Attachment[];
}

export interface Chat {
  _id: string;
  name: string;
  userId: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateChatDto {
  name: string;
  userId: string;
  messages?: Message[];
}

export interface SendMessageDto {
  chatId: string;
  message: string;
}

export interface RenameChatDto {
  name: string;
}

