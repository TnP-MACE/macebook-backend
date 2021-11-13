import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {Posts} from './entity/post.entity'
import User from 'src/user/entities/user.entity';
import { Comments } from 'src/comments/entities/comment.entity';
import Profile from 'src/profile/entities/profile.entity';

@Module({
  imports:[ TypeOrmModule.forFeature([ Posts,User,Comments,Profile])],
  providers: [PostsService],
  controllers: [PostsController]
})
export class PostsModule {}
