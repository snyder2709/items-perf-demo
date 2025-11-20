import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ItemsModule } from './modules/items/items.module';
import { SeedModule } from './modules/seed/seed.module';
@Module({
  imports: [
    ItemsModule,
    SeedModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env${!process.env.NODE_ENV || '.local'}`,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
