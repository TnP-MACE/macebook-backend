// import { Module, DynamicModule } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { config } from 'dotenv';
// config();
// import { Logger} from '@nestjs/common';
// import * as path from 'path';

// @Module({
//   providers: [],
// })
// export class ConfigDbModule {
  
//   static forRoot(): DynamicModule {
//     // const ePath = path.join(__dirname, '../**/*.entity{.ts,.js}');
//     // const mPath = path.join(__dirname, '../**/migrations/*{.ts,.js}');
//     // const logger = new Logger('dbconfig');
//     const isProduction = process.env.STAGE === 'prod';
//     // logger.log(`${process.env.STAGE}`)
//     const provider = TypeOrmModule.forRoot({
//       ssl: isProduction,
//       extra: {
//         ssl: isProduction? { rejectUnauthorised : false } : null
//       },
//       type: 'postgres',
//     //   url: process.env.DATABASE_URL,
//       // name :'dev',
//       host: process.env.DB_HOST,
//       port: Number(process.env.DB_PORT),
//       username: process.env.DB_USERNAME,
//       password: process.env.DB_PASSWORD,
//       // migrationsRun: true,
//       database: process.env.DB_NAME,
//       // entities: [ePath],
//       // migrations: [mPath],
//       synchronize: true,
//       autoLoadEntities: true,
//       logging: ['query', 'error', 'schema', 'warn', 'info', 'log'],
//     });
//     return {
//       module: ConfigDbModule,
//       imports: [provider],
//       // providers: [provider] ,
//       exports: [provider],
//     };
//   }
// }