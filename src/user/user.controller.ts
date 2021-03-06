import { Controller, Get, Post, Body, Patch, Param, Delete, Request, Req, Res, UseGuards, Logger } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import jwtAuthenticationGuard from './guards/jwt-auth.guard'
import localAuthenticationGuard from './guards/local-auth.guard'
import { Response } from 'express';
import RequestWithUser from './interfaces/requestWithUser.interface';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { EditUsernameDto } from './dto/edit-username.dto';
import { DeleteAccountDto } from './dto/delete-account.dto';

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

  @ApiBearerAuth()
  @UseGuards(jwtAuthenticationGuard)
  @Patch('edit-username')
  async editUsername(@Body() body : EditUsernameDto, @Req() req: RequestWithUser){
    const {uid} = req.user;
    const {username} = body;
    return await this.userService.editUsername(uid,username)
  }

  @ApiBearerAuth()
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

  @ApiBearerAuth()
  @UseGuards(jwtAuthenticationGuard)
  @Delete('delete-account')
  async deleteUser(@Body() body: DeleteAccountDto, @Req() req : RequestWithUser){
    try{
      const {password} = body;
      const {uid} = req.user;
      return await this.userService.deleteUser(uid,password); 
    } catch (err){
      throw err;
    }
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get details of logged in user' })
  @UseGuards(jwtAuthenticationGuard)
  @Get()
  authenticate(@Req() request: RequestWithUser) {
    const user = request.user;
    user.password = undefined;
    return user;
  }

  // Log Out Feature ( not to be used )
  // @ApiBearerAuth()
  // @UseGuards(jwtAuthenticationGuard)
  // @Post('logout')
  // async logOut(@Req() request, @Res() response: Response) {
  //   response.setHeader('Set-Cookie', this.userService.getCookieForLogOut());
  //   return response.sendStatus(200);
  // }
  
}
