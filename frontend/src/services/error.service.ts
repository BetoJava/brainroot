export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

export class ErrorService {
  /**
   * Gère les erreurs de l'API et retourne un message d'erreur lisible
   */
  handleApiError(error: any): ApiError {
    if (error instanceof Error) {
      return {
        message: error.message,
      };
    }

    if (error.response) {
      // Erreur HTTP avec réponse
      return {
        message: error.response.data?.message || 'Erreur du serveur',
        status: error.response.status,
        code: error.response.data?.code,
      };
    }

    if (error.request) {
      // Erreur de réseau
      return {
        message: 'Erreur de connexion au serveur',
        code: 'NETWORK_ERROR',
      };
    }

    // Erreur inconnue
    return {
      message: 'Une erreur inattendue s\'est produite',
      code: 'UNKNOWN_ERROR',
    };
  }

  /**
   * Affiche une notification d'erreur (peut être intégré avec un système de notifications)
   */
  showError(error: ApiError): void {
    console.error('Erreur API:', error);
    
    // Ici vous pouvez intégrer avec votre système de notifications
    // Par exemple, avec react-hot-toast, sonner, etc.
    if (typeof window !== 'undefined' && window.alert) {
      window.alert(`Erreur: ${error.message}`);
    }
  }

  /**
   * Vérifie si une erreur est récupérable (retry possible)
   */
  isRetryableError(error: ApiError): boolean {
    if (error.code === 'NETWORK_ERROR') {
      return true;
    }

    if (error.status && error.status >= 500) {
      return true;
    }

    return false;
  }
}

export const errorService = new ErrorService();


