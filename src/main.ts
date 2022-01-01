import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe} from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { config } from 'dotenv'; config();
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { config as configaws } from 'aws-sdk';

async function bootstrap() {
  const logger = new Logger('Macebook Server');
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:3000','https://mace-connect.herokuapp.com','https://zealous-kepler-913665.netlify.app','https://elated-poitras-25b86e.netlify.app','http://127.0.0.1:5500'],
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

  const configService = app.get((ConfigService))
  configaws.update({
    accessKeyId : configService.get('AWS_ACCESS_KEY_ID'),
    secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
    region: configService.get('AWS_REGION'),
  })
  
  const port = configService.get('PORT')|| 4009;
  await app.listen(port);
  logger.log(`Application Listening on Port ${port} `);
  
}
bootstrap();
