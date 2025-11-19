import { NestFactory } from '@nestjs/core';
import { pool } from 'infra/postgres';
import { AppModule } from './app.module';
import { SeedItemsService } from './modules/seed/seed.service';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const seedService = new SeedItemsService(pool);
  await seedService.seed();

  await app.listen(3000);
  console.log('App running on http://localhost:3000');
}

void bootstrap();
