import * as dotenv from 'dotenv';
import * as path from 'path';

// Charger les variables d'environnement
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// Validation simple des variables requises
const requiredEnvVars = ['MONGODB_URI', 'LLM_API_KEY', 'YT_DLP_PATH', 'STT_API_KEY'];

export function validateEnv(): void {
  const missingVars: string[] = [];

  for (const varName of requiredEnvVars) {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  }

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables:\n${missingVars.map((v) => `  - ${v}`).join('\n')}`
    );
  }
}

// Valider au chargement du module
validateEnv();

