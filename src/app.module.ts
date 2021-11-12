import { Module } from '@nestjs/common';
import { CommentsModule } from './comments/comments.module';
import { ConfigDbModule } from './config/dbConfig';
import { UserModule } from './user/user.module';
import { JobsModule } from './jobs/jobs.module';
import { ProfileModule } from './profile/profile.module';
import { PostsModule } from './posts/posts.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CompanyModule } from './company/company.module';
import { ConfigModule,ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.STAGE}`],
    }),
    // ConfigDbModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const isProduction = configService.get('STAGE') === 'prod'; 
        return{
        ssl: isProduction,
        extra: {
          ssl: isProduction? { rejectUnauthorised : false } : null
        },
        type: 'postgres',
        autoLoadEntities: true,
        synchronize: true,
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        }
      },
    }),
    UserModule,
    JobsModule,
    CommentsModule,
    ProfileModule,
    PostsModule,
    CompanyModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..','uploads'),  
    })
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
