# YouTube et Transcription Services

## Configuration requise

### Variables d'environnement
- `YT_DLP_PATH`: Chemin vers l'exécutable yt-dlp
- `MONGODB_URI`: URI de connexion MongoDB
- `LLM_API_KEY`: Clé API pour le LLM

### Dépendances système
- **yt-dlp**: Pour télécharger les métadonnées et l'audio des vidéos YouTube
- **Whisper**: Pour la transcription audio (installé via pip)

## Installation des dépendances système

### yt-dlp
```bash
# Windows (avec pip)
pip install yt-dlp

# Ou télécharger l'exécutable depuis https://github.com/yt-dlp/yt-dlp/releases
```

### Whisper
```bash
pip install openai-whisper
```

## API Endpoints

### YouTube Service

#### GET /youtube/metadata
Récupère les métadonnées d'une vidéo YouTube.

**Request:**
```json
{
  "url": "https://www.youtube.com/watch?v=VIDEO_ID"
}
```

**Response:**
```json
{
  "title": "Titre de la vidéo",
  "description": "Description de la vidéo",
  "thumbnail": "URL de la miniature",
  "duration": 120,
//   "uploader": "Nom du créateur"
}
```

#### POST /youtube/transcription
Transcrit une vidéo YouTube en texte.

**Request:**
```json
{
  "url": "https://www.youtube.com/watch?v=VIDEO_ID"
}
```

**Response:**
```json
{
  "transcription": "Texte transcrit de la vidéo"
}
```

### Transcription Service

#### POST /transcribe
Transcrit un fichier audio uploadé.

**Request:**
- Content-Type: multipart/form-data
- Field: `audio` (fichier audio)

**Formats supportés:**
- audio/mp3
- audio/wav
- audio/webm
- audio/ogg
- audio/m4a

**Response:**
```json
{
  "transcription": "Texte transcrit du fichier audio"
}
```

## Utilisation Frontend

### Service YouTube
```typescript
import { getVideoMetadata, getVideoTranscription } from '@/services/youtube.service';

// Récupérer les métadonnées
const metadata = await getVideoMetadata('https://www.youtube.com/watch?v=VIDEO_ID');

// Transcrire une vidéo
const transcription = await getVideoTranscription('https://www.youtube.com/watch?v=VIDEO_ID');
```

### Service Transcription
```typescript
import { transcriptionService } from '@/services/transcription.service';

// Transcrire un fichier audio
const transcription = await transcriptionService.transcribe(audioFile);
```

## Notes importantes

1. **Fichiers temporaires**: Les fichiers audio sont stockés temporairement dans `tmp/brainroot/` et sont automatiquement supprimés après traitement.

2. **Performance**: La transcription peut prendre du temps selon la durée de l'audio. Les vidéos YouTube sont d'abord téléchargées en audio MP3 avant transcription.

3. **Erreurs**: En cas d'erreur, les fichiers temporaires sont automatiquement nettoyés.

4. **Configuration**: Assurez-vous que `YT_DLP_PATH` pointe vers l'exécutable yt-dlp et que Whisper est installé et accessible depuis la ligne de commande.

