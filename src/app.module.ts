import { Module } from '@nestjs/common';
import { CommentsModule } from './comments/comments.module';
import { UserModule } from './user/user.module';
import { JobsModule } from './jobs/jobs.module';
import { ProfileModule } from './profile/profile.module';
import { PostsModule } from './posts/posts.module';
import { ConfigModule,ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configValidationSchema } from './config.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.STAGE}`],
      validationSchema: configValidationSchema,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const isProduction = configService.get('STAGE') === 'prod'; 
        return{
        ssl: isProduction ? { rejectUnauthorized: false } : null,
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
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
