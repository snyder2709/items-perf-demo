import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { chunkArrayAsync } from 'src/shared/lib/chunk-array-async';
function generateCosmicName() {
  return `${faker.science.chemicalElement().name}-${faker.science.chemicalElement().atomicNumber}`;
}

const green = '\x1b[32m';
const reset = '\x1b[0m';

@Injectable()
export class SeedItemsService {
  private targetItems = 50000;
  private batchSize = 5000;

  constructor(private readonly pool: Pool) {}

  async seed(): Promise<void> {
    console.info(
      `${green}[SeedService]:[seedItems]
      Starting seeding items...${reset}`,
    );

    try {
      await this.createTable();
      const currentCount = await this.getCurrentCount();

      if (currentCount >= this.targetItems) {
        console.info(
          `${green}[SeedService]:[seedItems]
          Already ${currentCount} rows — skipping${reset}`,
        );
        return;
      }

      await this.insert(currentCount);
      console.info(
        `${green}[SeedService]:[seedItems] Seeding complete. Total rows: ${this.targetItems}${reset}`,
      );
    } catch (err) {
      console.error('[SeedService]:[seedItems]', `Error seeding items: ${err}`);
    }
  }

  private async createTable(): Promise<void> {
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS items (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
    console.info(
      `${green}[SeedService]:[createTable] Table "items" ready ✔${reset}`,
    );
  }

  private async getCurrentCount(): Promise<number> {
    const result = await this.pool.query<{ count: string }>(
      'SELECT COUNT(*) AS count FROM items',
    );
    const count = Number(result.rows[0].count);
    console.info(
      `${green}[SeedService]:[getCurrentCount] Current rows: ${count}${reset}`,
    );
    return count;
  }

  private async insert(currentCount: number): Promise<void> {
    const remaining = this.targetItems - currentCount;

    console.info(
      `${green}[SeedService]:[insertItems] Inserting ${remaining} items...${reset}`,
    );

    const items: string[] = Array.from(
      { length: remaining },
      () => `('${generateCosmicName()}')`,
    );

    await chunkArrayAsync(items, this.batchSize, async (chunk, index) => {
      const sql = `INSERT INTO items (name) VALUES ${chunk.join(',')}`;
      await this.pool.query(sql);
      console.info(
        `${green}[SeedService]:[insertItems] Inserted batch ${index + 1}${reset}`,
      );
    });
  }
}
