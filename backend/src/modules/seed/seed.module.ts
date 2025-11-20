import { DatabaseService } from '@/infra/postgres/database.service';
import { Module } from '@nestjs/common';
import { SeedItemsService } from './seed.service';

@Module({
  providers: [SeedItemsService, DatabaseService],
  exports: [SeedItemsService],
})
export class SeedModule {}
