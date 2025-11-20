import { Injectable } from '@nestjs/common';
import { GetItemsQueryDto } from './dto/items.dto';
import { Item } from './items.dl';
import { CursorStrategy } from './strategies/cursor.strategy';
import { OffsetStrategy } from './strategies/offset.strategy';

@Injectable()
export class ItemsService {
  constructor(
    private readonly offsetStrategy: OffsetStrategy,
    private readonly cursorStrategy: CursorStrategy,
  ) {}

  async getItems(params: GetItemsQueryDto): Promise<Item[]> {

    if (params.cursor !== undefined) {
      return this.cursorStrategy.getItems(params);
    } else {
      return this.offsetStrategy.getItems(params);
    }
  }
}
