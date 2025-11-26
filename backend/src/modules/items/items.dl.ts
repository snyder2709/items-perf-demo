import { DatabaseService } from '@/infra/postgres/database.service';
import { Injectable } from '@nestjs/common';
import { DbMetricsService } from '../metrics/db-metrics.service';

export interface Item {
  id: number;
  name: string;
  created_at: Date;
}

@Injectable()
export class ItemsDl {

  constructor(
    private readonly db: DatabaseService,
    private readonly dbMetrics: DbMetricsService,
  ) { }

  async getCount(): Promise<number> {
    const sql = `SELECT COUNT(*) AS count FROM items;`;
    const result = await this.db.pool.query<{ count: string }>(sql);
    const count = result.rows[0].count;

    return Number(count);
  }
  async getItemsOffset(limit = 50, offset = 0): Promise<Item[]> {
    const queryInfo = {
      type: 'offset',
      limit,
      offset,
      timestamp: Date.now(),
    };

    const sql = `
      SELECT id, name, created_at
      FROM items
      ORDER BY id
      LIMIT $1 OFFSET $2
    `;

    return this.dbMetrics.measure(
      async () => {
        const result = await this.db.pool.query<Item>(sql, [limit, offset]);
        return result.rows;
      },
      queryInfo
    );
  }

  async getItemsCursor(limit = 50, cursorId = 0): Promise<Item[]> {
    const queryInfo = {
      type: 'cursor',
      limit,
      cursorId,
      timestamp: Date.now(),
    };

    const sql = `
      SELECT id, name, created_at
      FROM items
      WHERE id > $1
      ORDER BY id
      LIMIT $2
    `;

    return this.dbMetrics.measure(
      async () => {
        const result = await this.db.pool.query<Item>(sql, [cursorId, limit]);
        return result.rows;
      },
      queryInfo
    );
  }
}
