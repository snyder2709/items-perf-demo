import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { type DbMetrics } from './db-metrics.interface';
import { DbMetricsService } from './db-metrics.service';

@Controller('db-metrics')
export class DbMetricsController {
  constructor(private readonly dbMetricsService: DbMetricsService) {}

  @Post('start')
  startRun(): { runId: number } {
    const runId = this.dbMetricsService.startRun();
    return { runId };
  }

  @Post('finish')
    finishRun():{success: boolean} {
    this.dbMetricsService.finishRun();
    return {success: true}
  }

  @Get(':runId')
  getRunMetrics(
    @Param('runId', ParseIntPipe) runId: number
  ): DbMetrics | undefined {
    return this.dbMetricsService.getRunMetrics(runId);
  }

  @Get()
  getAllRuns(): DbMetrics[] {
    return this.dbMetricsService.getAllRuns();
  }

  @Delete(':runId')
  clearRun(
    @Param('runId', ParseIntPipe) runId: number
  ): { success: boolean } {
    const deleted = this.dbMetricsService.clearRun(runId);
    return { success: deleted };
  }

  @Delete()
  clearAll(): { success: boolean } {
    this.dbMetricsService.clearAllRuns();
    return { success: true };
  }
}
