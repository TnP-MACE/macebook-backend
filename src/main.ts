import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe} from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { config } from 'dotenv'; config();
import * as cookieParser from 'cookie-parser';
import { join } from 'path';

async function bootstrap() {
  const logger = new Logger('Macebook Server');
  const app = await NestFactory.create(AppModule);
  console.log(join(__dirname,'..','uploads'))
  app.enableCors({
    origin: ['http://localhost:3000','https://mace-connect.herokuapp.com'],
    credentials: true,
  })
  app.use(cookieParser());
  const swaggerOptions = new DocumentBuilder()
      .setTitle('Macebook Server')
      .setDescription('TnP MACE')
      .setVersion('1.0.0')
      .addBearerAuth({ type:'http'})
      .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup('api-doc', app, swaggerDocument);
  logger.log(`Api documentation available at "/api-doc/`); 

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    validationError: { target: false },
  }));

  const port = process.env.PORT || 4009;
  await app.listen(port);
  logger.log(`Application Listening on Port ${port} `);
  
}
bootstrap();
