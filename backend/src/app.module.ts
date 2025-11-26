import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ItemsModule } from './modules/items/items.module';
import { DbMetricsModule } from './modules/metrics/db-metrics.module';
import { SeedModule } from './modules/seed/seed.module';
import { ConditionalCacheInterceptor } from './shared/inerceptors/condition.cache';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      ttl: 2 * 60 * 1000,
    }),
    ItemsModule,
    SeedModule,
    DbMetricsModule,

    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env${!process.env.NODE_ENV || '.local'}`,
    }),
  ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ConditionalCacheInterceptor,
    },
  ],
})
export class AppModule {}
