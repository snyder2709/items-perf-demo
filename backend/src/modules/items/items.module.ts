import { Module } from '@nestjs/common';
import { DatabaseService } from 'src/infra/postgres/database.service';
import { ItemsController } from './items.controller';
import { ItemsDl } from './items.dl';
import { ItemsService } from './items.service';

@Module({
  providers: [ItemsService, ItemsDl, DatabaseService],
  controllers: [ItemsController],
})
export class ItemsModule {}
