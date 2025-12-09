import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '../config/config.service';
import { TranscribeService } from '../transcribe/transcribe.service';
import { Media, MediaDocument } from '../schemas/media.schema';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';

const execAsync = promisify(exec);

@Injectable()
export class YoutubeService {
  constructor(
    private readonly configService: ConfigService,
    private readonly transcribeService: TranscribeService,
    @InjectModel(Media.name) private mediaModel: Model<MediaDocument>,
  ) {}

  private extractYouTubeId(url: string): string {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/;
    const match = url.match(regex);
    if (!match) {
      throw new Error('URL YouTube invalide');
    }
    return match[1];
  }

  async getVideoMetadata(url: string): Promise<MediaDocument> {
    const videoId = this.extractYouTubeId(url);
    
    try {
      // Vérifier si le média existe déjà avec toutes les métadonnées
      const existingMedia = await this.mediaModel.findOne({ 
        id: videoId,
        title: { $exists: true, $ne: '' },
        thumbnail: { $exists: true, $ne: '' },
      });

      if (existingMedia) {
        return existingMedia;
      }

      // Si les métadonnées n'existent pas, les récupérer avec yt-dlp
      const ytDlpPath = this.configService.ytDlpPath;
      const { stdout } = await execAsync(
        `"${ytDlpPath}yt-dlp" --cookies /app/cookies.txt --encoding utf-8 --print title --print thumbnail --print duration_string --print description --no-warnings "${url}"`
      );
      
      const lines = stdout.trim().split('\n');
      
      const metadata = {
        title: lines[0] || '',
        thumbnail: lines[1] || '',
        duration: lines[2] || '',
        description: lines[3] || '',
      };

      // Créer ou mettre à jour le document dans la base de données
      const updatedMedia = await this.mediaModel.findOneAndUpdate(
        { id: videoId },
        {
          id: videoId,
          url: url,
          title: metadata.title,
          description: metadata.description,
          thumbnail: metadata.thumbnail,
          duration: metadata.duration,
        },
        { upsert: true, new: true }
      );

      return updatedMedia;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des métadonnées: ${error.message}`);
    }
  }

  async getVideoTranscription(url: string): Promise<MediaDocument> {
    const videoId = this.extractYouTubeId(url);
    
    try {
      // Vérifier si le média existe déjà avec la transcription
      const existingMedia = await this.mediaModel.findOne({ 
        id: videoId,
        transcription: { $exists: true, $ne: '' }
      });

      if (existingMedia) {
        return existingMedia;
      }

      // Si la transcription n'existe pas, la générer
      const ytDlpPath = this.configService.ytDlpPath;
      const tempDir = path.join(process.cwd(), 'tmp', 'brainroot');
      
      // Créer le dossier temporaire s'il n'existe pas
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }
      
      const audioPath = path.join(tempDir, `${Date.now()}.mp3`);
      
      try {
        // Télécharger l'audio de la vidéo
        await execAsync(
          `"${ytDlpPath}yt-dlp" -x --audio-format mp3 --audio-quality 0 -o "${audioPath}" --no-warnings "${url}"`
        );
        
        // Créer un File object à partir du fichier audio téléchargé
        const audioBuffer = fs.readFileSync(audioPath);
        const audioFile = new File([audioBuffer], 'audio.mp3', { type: 'audio/mp3' });
        
        // Transcrire l'audio avec le service de transcription
        const transcription = await this.transcribeService.transcribe(audioFile);
        
        // Créer ou mettre à jour le document dans la base de données avec la transcription
        const updatedMedia = await this.mediaModel.findOneAndUpdate(
          { id: videoId },
          {
            id: videoId,
            url: url,
            transcription: transcription,
          },
          { upsert: true, new: true }
        );

        // Nettoyer le fichier temporaire
        fs.unlinkSync(audioPath);
        
        return updatedMedia;
      } catch (error) {
        // Nettoyer le fichier temporaire en cas d'erreur
        if (fs.existsSync(audioPath)) {
          fs.unlinkSync(audioPath);
        }
        throw error;
      }
    } catch (error) {
      throw new Error(`Erreur lors de la transcription de la vidéo: ${error.message}`);
    }
  }

}