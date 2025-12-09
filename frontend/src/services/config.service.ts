export interface AppConfig {
  apiUrl: string;
  environment: 'development' | 'production' | 'test';
  features: {
    youtube: boolean;
    transcription: boolean;
    search: boolean;
    cache: boolean;
  };
  limits: {
    maxFileSize: number; // en bytes
    maxSearchResults: number;
    cacheTimeout: number; // en millisecondes
  };
}

export class ConfigService {
  private config: AppConfig;

  constructor() {
    this.config = {
      apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',
      environment: (import.meta.env.MODE as 'development' | 'production' | 'test') || 'development',
      features: {
        youtube: import.meta.env.VITE_FEATURE_YOUTUBE !== 'false',
        transcription: import.meta.env.VITE_FEATURE_TRANSCRIPTION !== 'false',
        search: import.meta.env.VITE_FEATURE_SEARCH !== 'false',
        cache: import.meta.env.VITE_FEATURE_CACHE !== 'false',
      },
      limits: {
        maxFileSize: parseInt(import.meta.env.VITE_MAX_FILE_SIZE || '10485760'), // 10MB par défaut
        maxSearchResults: parseInt(import.meta.env.VITE_MAX_SEARCH_RESULTS || '100'),
        cacheTimeout: parseInt(import.meta.env.VITE_CACHE_TIMEOUT || '300000'), // 5 minutes par défaut
      },
    };
  }

  /**
   * Récupère la configuration complète
   */
  getConfig(): AppConfig {
    return { ...this.config };
  }

  /**
   * Récupère l'URL de l'API
   */
  getApiUrl(): string {
    return this.config.apiUrl;
  }

  /**
   * Vérifie si l'application est en mode développement
   */
  isDevelopment(): boolean {
    return this.config.environment === 'development';
  }

  /**
   * Vérifie si l'application est en mode production
   */
  isProduction(): boolean {
    return this.config.environment === 'production';
  }

  /**
   * Vérifie si une fonctionnalité est activée
   */
  isFeatureEnabled(feature: keyof AppConfig['features']): boolean {
    return this.config.features[feature];
  }

  /**
   * Récupère une limite de configuration
   */
  getLimit(limit: keyof AppConfig['limits']): number {
    return this.config.limits[limit];
  }

  /**
   * Met à jour la configuration (utile pour les tests)
   */
  updateConfig(updates: Partial<AppConfig>): void {
    this.config = { ...this.config, ...updates };
  }

  /**
   * Réinitialise la configuration aux valeurs par défaut
   */
  resetConfig(): void {
    this.config = {
      apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',
      environment: (import.meta.env.MODE as 'development' | 'production' | 'test') || 'development',
      features: {
        youtube: import.meta.env.VITE_FEATURE_YOUTUBE !== 'false',
        transcription: import.meta.env.VITE_FEATURE_TRANSCRIPTION !== 'false',
        search: import.meta.env.VITE_FEATURE_SEARCH !== 'false',
        cache: import.meta.env.VITE_FEATURE_CACHE !== 'false',
      },
      limits: {
        maxFileSize: parseInt(import.meta.env.VITE_MAX_FILE_SIZE || '10485760'),
        maxSearchResults: parseInt(import.meta.env.VITE_MAX_SEARCH_RESULTS || '100'),
        cacheTimeout: parseInt(import.meta.env.VITE_CACHE_TIMEOUT || '300000'),
      },
    };
  }
}

export const configService = new ConfigService();


