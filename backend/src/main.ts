import { NestFactory } from '@nestjs/core';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { AppModule } from './app.module';
import { SeedItemsService } from './modules/seed/seed.service';

const SERVER_HOST = 'localhost';
const SERVER_PORT = process.env.PORT ? process.env.PORT : 3000;
const GLOBAL_PREFIX = 'api';
const CORS_ORIGIN = 'http://localhost:5173';
const CORS_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: CORS_ORIGIN,
    methods: CORS_METHODS,
  });


  app.setGlobalPrefix(GLOBAL_PREFIX);

  app.useWebSocketAdapter(new IoAdapter(app));

  const seedService = app.get(SeedItemsService);
  await seedService.seed();

  await app.listen(SERVER_PORT);


  console.log(`App running on http://${SERVER_HOST}:${SERVER_PORT}/${GLOBAL_PREFIX}`);
}

bootstrap();
