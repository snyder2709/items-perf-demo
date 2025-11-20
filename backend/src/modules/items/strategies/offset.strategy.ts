import { Injectable } from '@nestjs/common';
import { Item, ItemsDl } from '../items.dl';
import { ItemsStrategy } from './items-strategy.interface';

@Injectable()
export class OffsetStrategy implements ItemsStrategy {
  constructor(private readonly dl: ItemsDl) {}

  async getItems({ limit = 50, offset = 0 }: { limit?: number; offset?: number }): Promise<Item[]> {
    return this.dl.getItemsRegular(limit, offset);
  }
}
