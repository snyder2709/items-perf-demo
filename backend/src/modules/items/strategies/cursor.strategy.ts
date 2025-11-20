// strategies/optimized-items.strategy.ts
import { Injectable, Logger } from '@nestjs/common';
import { Item, ItemsDl } from '../items.dl';
import { ItemsStrategy } from './items-strategy.interface';

@Injectable()
export class CursorStrategy implements ItemsStrategy {
  private readonly logger = new Logger(CursorStrategy.name);

  constructor(private readonly dl: ItemsDl) {}

  async getItems({
    limit = 50,
    cursor,
    cache = false,
  }: { limit?: number; cursor?: number; cache?: boolean }): Promise<Item[]> {
    // TODO: Здесь можно добавить кэширование позже
    if (cache) {
      this.logger.log(`Cache enabled for cursor=${cursor}, limit=${limit}`);
    }

    return this.dl.getItemsCursor(limit, cursor);
  }
}
