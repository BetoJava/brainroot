import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { ConfigService } from '../config/config.service';

@Injectable()
export class OpenAIService {
  private openai: OpenAI;

  constructor(private readonly configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.llmApiKey,
      baseURL: this.configService.llmBaseUrl,
    });
  }

  async *streamChatCompletion(messages: Array<{ role: string; content: string }>) {
    const stream = await this.openai.chat.completions.create({
      model: this.configService.llmModel,
      messages: messages as OpenAI.Chat.ChatCompletionMessageParam[],
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        yield content;
      }
    }
  }
}

