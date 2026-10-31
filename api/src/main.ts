import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-tenant-id'],
  });
  const port = process.env.PORT || 3344;
  await app.listen(port);
  console.log(
    `[PulseGrid MFE & Notification GraphQL API] Listening on http://localhost:${port}/graphql`,
  );
}
bootstrap();
