export function extractYoutubeUrls(text: string): string[] {
    const regex = /https:\/\/(www\.youtube\.com\/watch\?v=[\w-]+|youtu\.be\/[\w-]+)/g;
    const matches = text.match(regex) || [];

    // Normalisation des URL pour retirer tous les arguments sauf 'v'
    const normalizedUrls = matches.map(url => {
        const urlObj = new URL(url);
        urlObj.searchParams.forEach((_, key) => {
            if (key !== 'v') {
                urlObj.searchParams.delete(key);
            }
        });
        return urlObj.toString();
    });

    return normalizedUrls;
}

export interface MediaDocument {
    id: string;
    url: string;
    title: string;
    description: string;
    thumbnail: string;
    duration: string;
    transcription: string;
}

export async function getVideoMetadata(url: string): Promise<MediaDocument> {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/youtube/metadata`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
    });

    if (!response.ok) {
        throw new Error('Erreur lors de la récupération des métadonnées');
    }


    const mediaDocument = await response.json();
    return mediaDocument;
}

export async function getVideoTranscription(url: string): Promise<MediaDocument> {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/youtube/transcription`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
    });

    if (!response.ok) {
        throw new Error('Erreur lors de la transcription de la vidéo');
    }

    const mediaDocument = await response.json();
    return mediaDocument;
}

export async function processFirstYoutubeUrl(url: string): Promise<MediaDocument> {
    try {
        // Lancer les deux appels en parallèle
        const partialPromise = getVideoMetadata(url);
        const completePromise = getVideoTranscription(url);
       
        // Attendre que les deux Promises se résolvent
        const [_, complete] = await Promise.all([
            partialPromise,
            completePromise
        ]);
        
        return complete;
    } catch (error) {
        console.error("Erreur lors du traitement de la vidéo :", error);
        throw new Error("Erreur lors du traitement de la vidéo.");
    }
}