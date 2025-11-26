import { Module } from '@nestjs/common';
import { DatabaseService } from 'src/infra/postgres/database.service';
import { ItemsController } from './items.controller';
import { ItemsDl } from './items.dl';
import { ItemsService } from './items.service';
import { CursorStrategy } from './strategies/cursor.strategy';
import { OffsetStrategy } from './strategies/offset.strategy';

@Module({
  providers: [
    ItemsService,
    ItemsDl,
    DatabaseService,
    OffsetStrategy,
    CursorStrategy,
  ],
  controllers: [ItemsController],
})
export class ItemsModule {}
