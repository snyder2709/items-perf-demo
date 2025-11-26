import { Global, Module } from '@nestjs/common';
import { DbMetricsController } from './db-metrics.controller';
import { DbMetricsService } from './db-metrics.service';
@Global()
@Module({
  providers: [DbMetricsService],
  exports: [DbMetricsService],
  controllers: [DbMetricsController],
})
export class DbMetricsModule {}
