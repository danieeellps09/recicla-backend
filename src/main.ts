import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { config } from 'dotenv';

config();


async function bootstrap() {
  // Cria uma instância da aplicação
  const app = await NestFactory.create(AppModule);
  app.use()
  // Configura o CORS
  const corsOptions: cors.CorsOptions = {
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  };
  app.use(cors(corsOptions));

  // Define a documentação da API usando o Swagger
  const config = new DocumentBuilder()
    .setTitle('Back-end Service')
    .setDescription('Serviço criado para operações no banco de dados')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/docs', app, document);

  // Define o uso de pipes globais para validação
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Inicia a aplicação
  await app.listen(3000);
}

bootstrap();



