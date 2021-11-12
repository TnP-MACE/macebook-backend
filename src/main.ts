import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger} from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { config } from 'dotenv'; config();
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const logger = new Logger('Macebook Server');
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
  app.use(cookieParser());
  const swaggerOptions = new DocumentBuilder()
      .setTitle('Macebook Server')
      .setDescription('TnP MACE')
      .setVersion('1.0.0')
      .addTag('TnP MACE')
      .addBearerAuth()
      // .addServer('http://')
      .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup('api-doc', app, swaggerDocument);
  logger.log(`Api documentation available at "/api-doc/`);

  const port = process.env.PORT || 4009;
  await app.listen(port);
  logger.log(`Application Listening on Port ${port} `);

}
bootstrap();
