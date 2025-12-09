import { Controller, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TranscribeService } from './transcribe.service';

@Controller('transcribe')
export class TranscribeController {
  constructor(private readonly transcribeService: TranscribeService) {}

  @Post()
  @UseInterceptors(FileInterceptor('audio'))
  async transcribe(@UploadedFile() audioFile: any): Promise<{ transcription: string }> {
    if (!audioFile) {
      throw new Error('Aucun fichier audio fourni');
    }

    // Convertir Express.Multer.File en File
    const file = new File([audioFile.buffer], audioFile.originalname, { 
      type: audioFile.mimetype 
    });

    const transcription = await this.transcribeService.transcribe(file);
    return { transcription };
  }
}
