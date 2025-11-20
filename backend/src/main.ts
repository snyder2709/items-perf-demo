import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SeedItemsService } from './modules/seed/seed.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });
  const seedService = app.get(SeedItemsService);
  await seedService.seed();

  await app.listen(3000);
  console.log('App running on http://localhost:3000');
}

void bootstrap();
