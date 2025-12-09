import type { Chat, Attachment } from '@/types/chat.types';
import apiClient from '@/lib/api-client-utils';

/**
 * Service pour gérer les interactions avec l'API de chat
 */
class ChatService {
  /**
   * Envoie un message au chat et retourne un stream de réponses
   */
  async sendMessage(
    chatId: string,
    message: string,
    attachments: Attachment[]
  ): Promise<ReadableStream<Uint8Array>> {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/chats/stream`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream', 
        },
        body: JSON.stringify({
          chatId,
          message,
          attachments,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    if (!response.body) {
      throw new Error('Impossible de lire la réponse');
    }

    return response.body;
  }

  /**
   * Parse un stream de réponses SSE
   */
  async *parseStream(
    stream: ReadableStream<Uint8Array>
  ): AsyncGenerator<string, void, unknown> {
    const reader = stream.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
  
    try {
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;
  
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';
  
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim();
            if (data) {
              try {
                const parsed = JSON.parse(data);
                if (parsed.chunk) {
                  yield parsed.chunk;
                }
              } catch {
                yield data;
              }
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }
  
  async getChat(chatId: string): Promise<Chat> {
    return apiClient.get(`/chats/${chatId}`);
  }

  async getAllChats(): Promise<Chat[]> {
    return apiClient.get('/chats');
  }

  async createChat(name: string): Promise<Chat> {
    return apiClient.post('/chats', { name });
  }

  async deleteChat(chatId: string): Promise<void> {
    return apiClient.delete(`/chats/${chatId}`);
  }

  async renameChat(chatId: string, name: string): Promise<Chat> {
    return apiClient.patch(`/chats/${chatId}`, { name });
  }
}

export const chatService = new ChatService();