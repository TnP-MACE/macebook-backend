import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import Profile from './entities/profile.entity';
import Connections from './entities/connections.entity';
import Skills from './entities/skills.entity';
import Experience from './entities/experience.entity';
import { Posts } from 'src/posts/entity/post.entity';
import { Comments } from 'src/comments/entities/comment.entity';
import User from 'src/user/entities/user.entity';

@Module({
 imports:[ TypeOrmModule.forFeature([ Profile,Connections,Skills,Experience,Posts,Comments,User ])],
  controllers: [ProfileController],
  providers: [ProfileService]
})
export class ProfileModule {}