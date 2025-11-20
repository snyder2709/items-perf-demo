import { faker } from '@faker-js/faker';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from 'src/infra/postgres/database.service';
import { chunkArrayAsync } from 'src/shared/lib/chunk-array-async';

function generateCosmicName() {
  return `${faker.science.chemicalElement().name}-${faker.science.chemicalElement().atomicNumber}`;
}

@Injectable()
export class SeedItemsService {
  private readonly logger = new Logger(SeedItemsService.name);
  private readonly batchSize = 5000;
  private targetItems: number;

  constructor(
    private readonly db: DatabaseService,
    private readonly configService: ConfigService,
  ) {
    this.targetItems = this.configService.get<number>(
      'SEED_TARGET_ITEMS',
      50000,
    );
  }

  async seed(): Promise<void> {
    this.logger.log('Starting seeding items...');

    try {
      await this.createTable();
      const currentCount = await this.getCurrentCount();

      if (currentCount >= this.targetItems) {
        this.logger.log(`Already ${currentCount} rows — skipping`);
        return;
      }

      await this.insert(currentCount);
      this.logger.log(`Seeding complete. Total rows: ${this.targetItems}`);
    } catch (err) {
      this.logger.error('Error seeding items:', err);
    }
  }

  private async createTable(): Promise<void> {
    const sql = `
      CREATE TABLE IF NOT EXISTS items (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `;
    await this.db.pool.query(sql);
    this.logger.log('Table "items" ready ✔');
  }

  private async getCurrentCount(): Promise<number> {
    const result = await this.db.pool.query<{ count: string }>(
      'SELECT COUNT(*) AS count FROM items',
    );
    const count = Number(result.rows[0].count);
    this.logger.log(`Current rows: ${count}`);
    return count;
  }

  private async insert(currentCount: number): Promise<void> {
    const remaining = this.targetItems - currentCount;
    this.logger.log(`Inserting ${remaining} items...`);

    const items: string[] = Array.from(
      { length: remaining },
      () => `('${generateCosmicName()}')`,
    );

    await chunkArrayAsync(items, this.batchSize, async (chunk, index) => {
      const sql = `INSERT INTO items (name) VALUES ${chunk.join(',')}`;
      await this.db.pool.query(sql);
      this.logger.log(
        `Inserted batch ${index + 1}/${Math.ceil(remaining / this.batchSize)}`,
      );
    });
  }
}
