import { Module, Global } from '@nestjs/common';
import './env.validation'; // Charge et valide les variables d'environnement
import { ConfigService } from './config.service';

@Global()
@Module({
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}

