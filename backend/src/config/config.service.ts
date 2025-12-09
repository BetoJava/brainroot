import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
  // Server Configuration
  get port(): number {
    return parseInt(process.env.PORT || '3000', 10);
  }

  get nodeEnv(): string {
    return process.env.NODE_ENV || 'development';
  }

  get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  // Database Configuration
  get mongodbUri(): string {
    return process.env.MONGODB_URI!;
  }

  // LLM Configuration
  get llmApiKey(): string {
    return process.env.LLM_API_KEY!;
  }

  get llmBaseUrl(): string {
    return process.env.LLM_BASE_URL || 'https://api.openai.com/v1';
  }

  get llmModel(): string {
    return process.env.LLM_MODEL || 'gpt-4o-mini';
  }

  get frontendUrl(): string {
    return process.env.FRONTEND_URL || 'http://localhost:5173';
  }

  get ytDlpPath(): string {
    // En production (Docker), yt-dlp est installé globalement
    if (this.isProduction) {
      return '';
    }
    // En développement, utiliser le chemin local
    return process.env.YT_DLP_PATH || './bin/';
  }

  get sttApiKey(): string {
    return process.env.STT_API_KEY!;
  }

  get sttBaseUrl(): string {
    return process.env.STT_BASE_URL || 'https://api.openai.com/v1';
  }

  get sttModel(): string {
    return process.env.STT_MODEL || 'whisper-large-v3-turbo';
  }
}

