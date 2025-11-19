import { pool } from 'infra/postgres';

export interface Item {
  id: number;
  name: string;
  created_at: Date;
}

export class ItemsDl {
  async findAll(limit = 50, offset = 0): Promise<Item[]> {
    const sql = `
      SELECT id, name, created_at
      FROM items
      ORDER BY id
      LIMIT $1 OFFSET $2
    `;

    try {
      const result = await pool.query<Item>(sql, [limit, offset]);
      return result.rows;
    } catch (err) {
      console.error('[ItemsDl]:[findAll]', `Error executing SQL query: ${err}`);
      throw err;
    }
  }
}
