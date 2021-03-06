import { Injectable, HttpException, HttpStatus,Logger  } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import { Repository, DeleteResult } from 'typeorm';
import User from './entities/user.entity';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  private logger = new Logger(UserService.name);
  constructor (
    @InjectRepository (User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService : JwtService,
  ){}

  // register a user
  public async register(data: CreateUserDto){
    try {
        const { email, username } = data;
        let user = await this.userRepository.findOne({
          email: email.toLowerCase(),
        });
        if (user) {
            throw new HttpException('E-mail already exist, please login.', HttpStatus.BAD_REQUEST);
          }
         user = await this.userRepository.findOne({username: username.toLowerCase()})
        if (user){
          // return {
          //   success: false,
          //   message: 'Username already taken'
          // }
          throw new HttpException('Username already taken', HttpStatus.BAD_REQUEST);
        } else {
          data.password = await bcrypt.hash(data.password, 10);
          data.status = 'ACTIVE';
          data.uid = uuidv4();
          const result = await this.userRepository.save(data);
          // const { ...result } = fetchUser;
          delete result.password;
          return {
            success: true,
            data: result,
          };
        }
    } catch (err) {
      //console.log('err', err);
      // return {
      //   success: false,
      //   message: err,
      // };
      throw err;
    }
  }

  public async validateUser(email: string, password: string): Promise<any> {
      const user = await this.userRepository.findOne({where:{email}});
      if (user) {
        const match = await bcrypt.compare(password, user.password);
        if (match) {
          return user;
        }
        throw new HttpException('Password incorrect', HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
  }

  public async validateUserJwt(email: string): Promise<any> {
    const user = await this.userRepository.findOne({where:{email}});
    if (user) 
        return user;
    throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
  }

  //Login 
  public login(user1: any){ 
      delete user1.password
      const payload = { email: user1.email };
      const accessToken = this.jwtService.sign(payload);
      return accessToken
      // return `Authentication=${accessToken}; HttpOnly; Path=/; Max-Age=${jwtConstants.expiresin}`;  
  }

  //Edit username
  public async editUsername(uid: string, username: string){
    await this.userRepository
      .createQueryBuilder()
      .update(User)
      .set({username : username})
      .where('uid = :uid',{ uid})
      .execute()
      return { success:true}
  }

  // Change password
  public async changePassword (email : string, data : ChangePasswordDto){
    try{
    const user = await this.validateUser(email,data.currentPassword)
    if (user){
      await this.userRepository
          .createQueryBuilder()
          .update(User)
          .set({password : await bcrypt.hash(data.password, 10)})
          .where('email = :email',{email})
          .execute();
      return { success:true}
    }
    }catch (err){
      throw err;
    }
  }

  //Delete account 
  public async deleteUser(uid : string, password: string) :  Promise<any>  {
    try{
      const userToDelete = await this.userRepository.findOne({where:{uid}})
      if (await bcrypt.compare(password,userToDelete.password)){
        await this.userRepository
          .createQueryBuilder()
          .delete()
          .from(User)
          .where('uid = :uid',{ uid})
          .execute();
        return { success:true}
      }
      throw new HttpException('Password incorrect', HttpStatus.UNAUTHORIZED);
    } catch (err){
      throw err;
    }
  }

  // Logout
  // public getCookieForLogOut() {
  //   return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
  // }

}