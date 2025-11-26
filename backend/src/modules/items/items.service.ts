import { Injectable } from '@nestjs/common';
import { GetItemsQueryDto, ItemsQueryType } from './dto/items.dto';
import { Item, ItemsDl } from './items.dl';
import { CursorStrategy } from './strategies/cursor.strategy';
import { OffsetStrategy } from './strategies/offset.strategy';

@Injectable()
export class ItemsService {
  constructor(
    private readonly offsetStrategy: OffsetStrategy,
    private readonly cursorStrategy: CursorStrategy,
    private readonly itemsDl: ItemsDl,
  ) {}

  async getItems(params: GetItemsQueryDto): Promise<Item[]> {
    switch (params.type) {
      case ItemsQueryType.CURSOR:
        return this.cursorStrategy.getItems(params);

      case ItemsQueryType.OFFSET:
        return this.offsetStrategy.getItems(params);

      default:
        return [];
    }
  }
  async getCount():Promise<number> {
    return this.itemsDl.getCount()
  }
}
