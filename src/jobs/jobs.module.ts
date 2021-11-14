import { Module } from '@nestjs/common';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import Jobs from './entities/jobs.entity';
import Applications from './entities/applications.entity';
import Profile from '../profile/entities/profile.entity';


@Module({
 imports:[ TypeOrmModule.forFeature([ Jobs,Applications,Profile ])],
  controllers: [JobsController],
  providers: [JobsService]
})
export class JobsModule {}
