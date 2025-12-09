
/**
 * Service pour gérer la transcription audio
 */
export class TranscriptionService {
  /**
   * Transcrit un fichier audio en texte
   */
  async transcribe(audioFile: File): Promise<string> {
    const formData = new FormData();
    formData.append("audio", audioFile);

    const response = await fetch(`${import.meta.env.VITE_API_URL}/transcribe`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la transcription");
    }

    const { transcription } = (await response.json()) as { transcription: string };
    return transcription;
  }
}

export const transcriptionService = new TranscriptionService();