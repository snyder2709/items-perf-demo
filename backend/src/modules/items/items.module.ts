import { Module } from '@nestjs/common';
import { ItemsController } from './items.controller';
import { ItemsDl } from './items.dl';
import { ItemsService } from './items.service';

@Module({
  providers: [ItemsService, ItemsDl],
  controllers: [ItemsController],
})
export class ItemsModule {}
