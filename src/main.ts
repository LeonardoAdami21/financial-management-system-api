import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { appPort } from './env/envoriment';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Financial Management Api')
    .setDescription('Tecnologias: Nestjs, Swagger, Prisma, Postgres e Docker')
    .addBearerAuth()
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  await app.listen(appPort || 3000, () =>
    console.log(`Api is Running on http://localhost:${appPort}/api`),
  );
}
bootstrap();
