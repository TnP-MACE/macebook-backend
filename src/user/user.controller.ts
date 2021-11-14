import { Controller, Get, Post, Body, Patch, Param, Delete, Request, Req, Res, UseGuards, Logger } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { jwtConstants } from '../config/constants';
import jwtAuthenticationGuard from './guards/jwt-auth.guard'
import localAuthenticationGuard from './guards/local-auth.guard'
import { Response } from 'express';
import RequestWithUser from './interfaces/requestWithUser.interface';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication & User')
@Controller('api/v1/auth')
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(private readonly userService: UserService) {}

  @Post('register')
  register(@Body() createUserDto: CreateUserDto): Promise<any> {
    return this.userService.register(createUserDto);
  }

  @UseGuards(localAuthenticationGuard)
  @Post('login')
  async login(@Req() request: RequestWithUser, @Body() loginUserDto:LoginUserDto, @Res({ passthrough: true }) res: Response) {
    const accessToken  = this.userService.login(request.user);
    // res.setHeader('Set-Cookie', cookie)
    return {...request.user, access_token: accessToken }
  }

  @UseGuards(jwtAuthenticationGuard)
  @Post('logout')
  async logOut(@Req() request, @Res() response: Response) {
    response.setHeader('Set-Cookie', this.userService.getCookieForLogOut());
    return response.sendStatus(200);
  }

  @UseGuards(jwtAuthenticationGuard)
  @Delete('delete-account')
  async deleteUser(@Body() body, @Req() req : RequestWithUser){
    try{
      const {password} = body;
      const {uid} = req.user;
      return await this.userService.deleteUser(uid,password); 
    } catch (err){
      throw err;
    }
  }

  @UseGuards(jwtAuthenticationGuard)
  @Patch('edit-username')
  async editUsername(@Body() body, @Req() req: RequestWithUser){
    const {uid} = req.user;
    const {username} = body;
    return await this.userService.editUsername(uid,username)
  }

  @UseGuards(jwtAuthenticationGuard)
  @Patch('change-password')
  async changePass(@Body() changePasswordDto: ChangePasswordDto, @Req() req: RequestWithUser){
    try{
    const {email} = req.user;
    return await this.userService.changePassword(email,changePasswordDto)
    } catch (err){
      throw err
    }
  }

  @UseGuards(jwtAuthenticationGuard)
  @Get()
  authenticate(@Req() request: RequestWithUser) {
    const user = request.user;
    user.password = undefined;
    return user;
  }
}
