import { TypeOrmModule } from '@nestjs/typeorm';
import databaseConfig from './config.js';

export const DatabaseModule = TypeOrmModule.forRoot(databaseConfig);
