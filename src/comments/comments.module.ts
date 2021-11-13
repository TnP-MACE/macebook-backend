import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Posts } from 'src/posts/entity/post.entity';
import Profile from 'src/profile/entities/profile.entity';
import User from 'src/user/entities/user.entity';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.services';
import  {Comments}  from './entities/comment.entity'


@Module({
  imports: [
    TypeOrmModule.forFeature([ Comments, Posts,User,Profile ])
  ],
  controllers: [CommentsController],
  providers: [CommentsService]
})
export class CommentsModule {}