import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from 'src/infra/postgres/database.service';

export interface Item {
  id: number;
  name: string;
  created_at: Date;
}

@Injectable()
export class ItemsDl {
  private readonly logger = new Logger(ItemsDl.name);

  constructor(private readonly db: DatabaseService) {}

  async getItemsRegular(limit = 50, offset = 0): Promise<Item[]> {
    const sql = `
      SELECT id, name, created_at
      FROM items
      ORDER BY id
      LIMIT $1 OFFSET $2
    `;

    try {
      const result = await this.db.pool.query<Item>(sql, [limit, offset]);
      return result.rows;
    } catch (err) {
      this.logger.error('Error executing SQL query in findAll', err);
      throw err;
    }
  }
  async getItemsCursor(limit = 50, offset = 0): Promise<Item[]> {
    const sql = `
      SELECT id, name, created_at
      FROM items
      ORDER BY id
      LIMIT $1 OFFSET $2
    `;

    try {
      const result = await this.db.pool.query<Item>(sql, [limit, offset]);
      return result.rows;
    } catch (err) {
      this.logger.error('Error executing SQL query in findAll', err);
      throw err;
    }
  }
}
