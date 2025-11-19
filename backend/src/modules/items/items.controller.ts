import { Controller, Get, Query } from '@nestjs/common';
import { Item } from './items.dl';
import { ItemsService } from './items.service';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Get()
  async getItems(
    @Query('limit') limit = '50',
    @Query('offset') offset = '0',
  ): Promise<Item[]> {
    const parsedLimit = parseInt(limit, 10);
    const parsedOffset = parseInt(offset, 10);
    return await this.itemsService.getItems(parsedLimit, parsedOffset);
  }
}
