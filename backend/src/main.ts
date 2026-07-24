import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    // Enable CORS for frontend communication
    app.enableCors();

    // Serve static files from 'uploads' directory
    app.useStaticAssets(join(__dirname, '..', 'uploads'), {
        prefix: '/uploads/',
    });

    // Global Validation Pipe for DTOs
    app.useGlobalPipes(new ValidationPipe());

    // Swagger setup for Flutter/Mobile client generation
    const config = new DocumentBuilder()
        .setTitle('StoryVerse API')
        .setDescription('The StoryVerse Backend API description for Web & Mobile')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    await app.listen(3001); // Running on port 3001 to avoid conflict with Next.js (3000)
}
bootstrap();
