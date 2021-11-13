import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import {TypeOrmModule} from '@nestjs/typeorm';
import  User  from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import {JwtStrategy} from './strategies/jwt.strategy'
import { LocalStrategy } from './strategies/local.strategy';
import Profile from 'src/profile/entities/profile.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([ User,Profile ]), 
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions:{
        expiresIn: process.env.EXPIRESIN,
      },
    }),
  ],
  controllers: [UserController],
  providers: [UserService,JwtStrategy,LocalStrategy]
})
export class UserModule {}
