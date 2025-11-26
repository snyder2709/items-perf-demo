import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';

@Injectable()
export class DatabaseService {
  private readonly logger = new Logger(DatabaseService.name);
  public pool: Pool;

  constructor(private configService: ConfigService) {
    const user = this.configService.get<string>('POSTGRES_USER');
    const password = this.configService.get<string>('POSTGRES_PASSWORD');
    const host = this.configService.get<string>('POSTGRES_HOST', 'localhost');
    const port = this.configService.get<number>('POSTGRES_PORT', 5432);
    const database = this.configService.get<string>('POSTGRES_DB');

    if (!user || !password || !database) {
      throw new Error('Database credentials are not defined');
    }

    const connectionString = `postgresql://${user}:${password}@${host}:${port}/${database}`;

    this.pool = new Pool({ connectionString, max: 50, idleTimeoutMillis: 3000 });

    this.pool.on('connect', () => {
      this.logger.log(`Connected to database at ${host}:${port}`);
    });

    this.pool.on('error', (err) => {
      this.logger.error('Unexpected error on idle client', err);
    });
  }
}
