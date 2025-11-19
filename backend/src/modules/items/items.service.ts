import { Injectable } from '@nestjs/common';
import { Item, ItemsDl } from './items.dl';

@Injectable()
export class ItemsService {
  constructor(private itemsDl: ItemsDl) {}
  async getItems(limit = 50, offset = 0): Promise<Item[]> {
    return await this.itemsDl.findAll(limit, offset);
  }
}
