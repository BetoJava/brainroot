import { Controller, Get, Post, Body, Patch, Param, Delete, Sse, Query } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ChatsService } from './chats.service';
import { OpenAIService } from './openai.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { SendMessageDto } from './dto/send-message.dto';

@Controller('chats')
export class ChatsController {
  constructor(
    private readonly chatsService: ChatsService,
    private readonly openaiService: OpenAIService,
  ) {}

  @Post()
  create(@Body() createChatDto: CreateChatDto) {
    return this.chatsService.create(createChatDto);
  }

  @Get()
  findAll() {
    return this.chatsService.findAll();
  }


  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChatDto: UpdateChatDto) {
    return this.chatsService.update(id, updateChatDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chatsService.remove(id);
  }

  @Post('stream')
  @Sse()
  async streamMessage(
    @Body() body: SendMessageDto
  ): Promise<Observable<MessageEvent>> {
    return new Observable((observer) => {
      (async () => {
        try {
          const { chatId, message, attachments } = body;

          // 1. Ajouter le message utilisateur
          const userMessage = {
            role: 'user' as const,
            content: message,
            createdAt: new Date(),
            attachments: attachments || [],
          };
          await this.chatsService.addMessage(chatId, userMessage);

          // 2. Récupérer l'historique
          const messages = await this.chatsService.getProcessedMessages(chatId);
          
          // Validation: s'assurer que tous les messages ont un role
          
          const formattedMessages = messages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          }));

          // 3. Stream la réponse
          let assistantResponse = '';
          for await (const chunk of this.openaiService.streamChatCompletion(
            formattedMessages
          )) {
            assistantResponse += chunk;
            // Envoyer chaque chunk
            observer.next({ 
              data: JSON.stringify({ chunk }) 
            } as MessageEvent);
          }

          // 4. Sauvegarder la réponse complète
          const assistantMessage = {
            role: 'assistant' as const,
            content: assistantResponse,
            createdAt: new Date(),
            attachments: [],
          };
          await this.chatsService.addMessage(chatId, assistantMessage);

          // Signal de fin
          observer.next({ 
            data: JSON.stringify({ done: true }) 
          } as MessageEvent);
          
          observer.complete();
        } catch (error) {
          console.error('Stream error:', error);
          observer.error(error);
        }
      })();
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chatsService.findOne(id);
  }
}
