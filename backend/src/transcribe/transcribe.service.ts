import { Injectable } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import OpenAI from 'openai';

@Injectable()
export class TranscribeService {
  private openai: OpenAI;

  constructor(private readonly configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.sttApiKey,
      baseURL: this.configService.sttBaseUrl,
    });
  }

  async transcribe(audioFile: File): Promise<string> {
    try {
      // Convertir le fichier en buffer
      const audioBuffer = await audioFile.arrayBuffer();
      
      // Créer un objet File pour l'API OpenAI
      const audioBlob = new Blob([audioBuffer], { type: audioFile.type });
      const audioFileForOpenAI = new File([audioBlob], audioFile.name, { type: audioFile.type });
      
      // Utiliser l'API OpenAI pour transcrire l'audio
      const transcription = await this.openai.audio.transcriptions.create({
        file: audioFileForOpenAI,
        model: this.configService.sttModel,
        language: 'fr',
        response_format: 'text',
      });
      
      return transcription;
    } catch (error) {
      throw new Error(`Erreur lors de la transcription: ${error.message}`);
    }
  }

}
