import { Controller, Get, Query } from '@nestjs/common';
import { GetItemsQueryDto } from './dto/items.dto';
import { Item } from './items.dl';
import { ItemsService } from './items.service';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Get()
  async getItems(
    @Query() query: GetItemsQueryDto,
  ): Promise<Item[]> {
    return await this.itemsService.getItems(query);
  }
}
