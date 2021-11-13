import { Body, Controller, Delete, Get, HttpServer, Param, Patch, Post, Req, UploadedFile, UploadedFiles, UseGuards, UseInterceptors, } from '@nestjs/common';
import { AnyFilesInterceptor, FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import path, { extname } from 'path';
import { ProfileDto, ProfileParameter } from './dto/create-profile.dto';
import { ProfileService } from './profile.service'
import { v4 as uuidv4 } from 'uuid';
import { request } from 'http';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProfileSwagger } from './entities/profile.entity';
import { ConnectionDto } from './dto/connection.dto';
import { ExperienceDto } from './dto/experience.dto';
import RequestWithUser from 'src/user/interfaces/requestWithUser.interface';
import { AuthGuard } from '@nestjs/passport';
@ApiBearerAuth()
@ApiTags('profile')
@Controller('api/v1/profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {
  }

  @Get('/')
  @ApiOperation({ summary: 'Get All Profile' })
  Findprofile(): Promise<any> {
    return this.profileService.getProfileDetails()
  }
  @Get('/search/:key')
  @ApiOperation({ summary: 'Search Profile' })
  @ApiParam({ name: 'key', required: true, schema: { oneOf: [{ type: 'string' }] } })
  Searchprofile(@Param() param: any): Promise<any> {
    return this.profileService.getProfileDetails()
  }
  @UseGuards(AuthGuard('jwt'))
  @Get('/p1')
  @ApiOperation({ summary: 'Get Profile by id' })
  // @ApiParam({ name: 'profile_id', required: true, schema: { oneOf: [{ type: 'string' }] } })
  FindOneProfile(@Req() req:RequestWithUser): Promise<any> {
    console.log(req.user.uid);
    return this.profileService.getOneprofileDetail(req.user.uid)
  }
  //     @Get('/p2/:profile_id')
  //     @ApiOperation({ summary: 'Get Profile by id' })
  //   @ApiParam({name: 'profile_id', required: true, schema: { oneOf: [{type: 'string'}]}})
  //     FindProfileWithConnectionStatus(@Param() profile_id: string): Promise<any> {
  //         return this.profileService.getOneprofileDetailwithConnection(profile_id)
  //     }
  @UseGuards(AuthGuard('jwt'))
  @Post('/completion')
  @ApiOperation({ summary: 'Complete Profile' })
  // @ApiParam({ name: 'profile_id', required: true, schema: { oneOf: [{ type: 'string' }] } })
  AddProfile(@Body() profileDto: ProfileDto, @Req() req: RequestWithUser) {
    return this.profileService.insertprofile(profileDto, req.user.uid);
  }
  @UseGuards(AuthGuard('jwt'))
  @Patch('/updation')
  @ApiOperation({ summary: 'Update Profile' })
  PutProfile(@Body() profileDto: ProfileDto, @Req() req: RequestWithUser) {
    console.log(req.user.uid)
    return this.profileService.updateprofile(profileDto,req.user.uid);
  }
  @UseGuards(AuthGuard('jwt'))
  @Delete('')
  @ApiOperation({ summary: 'Get Profile details> Will not be used' })
  DeleteProfile(@Req() req: RequestWithUser): Promise<any> {
    return this.profileService.deleteprofile(req.user.uid);
  }





  // ed1e67bb-b7c6-4da9-a628-46db57167402

  // PROFILE AND COVER IMAGES
  @UseGuards(AuthGuard('jwt'))
  @Post('/picture')
  @ApiOperation({ summary: 'Upload profile image' })
  // @ApiParam({ name: 'profile_id', required: true, schema: { oneOf: [{ type: 'string' }] } })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        profilepicture: {
          type: 'string',
          format: 'jpg',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('profilepicture', {
    storage: diskStorage({
      destination: './uploads/profile',
      filename: (req, file, cb) => {
        const fileName = uuidv4();
        return cb(null, `${fileName}${extname(file.originalname)}`);
      }
    })
  }))
  uploadProfileImage(@Req() req: RequestWithUser, @UploadedFile() file: Express.Multer.File) {
    return this.profileService.uploadprofileimage(req.user.uid, file.filename);
  }
  @UseGuards(AuthGuard('jwt'))
  @Post('/cover')
  @ApiOperation({ summary: 'Upload Cover image' })
  // @ApiParam({ name: 'profile_id', required: true, schema: { oneOf: [{ type: 'string' }] } })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        cover: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('cover', {
    storage: diskStorage({
      destination: './uploads/cover',
      filename: (req, file, cb) => {
        const fileName = uuidv4();
        return cb(null, `${fileName}${extname(file.originalname)}`);
      }
    })
  }))
  uploadProfileCover( @UploadedFile() file: Express.Multer.File,@Req() req: RequestWithUser) {
    console.log(file)
    return this.profileService.uploadcoverimage(req.user.uid, file.filename);
  }
  @UseGuards(AuthGuard('jwt'))
  @Patch('/picture')
  @ApiOperation({ summary: 'Update profile image' })
  // @ApiParam({ name: 'profile_id', required: true, schema: { oneOf: [{ type: 'string' }] } })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        profilepicture: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('profilepicture', {
    storage: diskStorage({
      destination: './uploads/profile',
      filename: (req, file, cb) => {
        const fileName = uuidv4();
        return cb(null, `${fileName}${extname(file.originalname)}`);
      }
    })
  }))
  
  updateImage(@Req() req: RequestWithUser, @UploadedFile() file: Express.Multer.File) {
    console.log(req)
    console.log("req")
    console.log(file.filename)
    return this.profileService.updateprofileimage(req.user.uid,  file.filename);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('/cover')
  @ApiOperation({ summary: 'Update Cover image' })
  // @ApiParam({ name: 'profile_id', required: true, schema: { oneOf: [{ type: 'string' }] } })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        cover: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('cover', {
    storage: diskStorage({
      destination: './uploads/cover',
      filename: (req, file, cb) => {
        const fileName = uuidv4();
        return cb(null, `${fileName}${extname(file.originalname)}`);
      }
    })
  }))
  updateProfileImage( @UploadedFile() file: Express.Multer.File,@Req() req: RequestWithUser) {
    console.log(file)
    return this.profileService.updatecoverimage(req.user.uid,  file.filename);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/picture')
  @ApiOperation({ summary: 'Delete profile image' })
  // @ApiParam({ name: 'profile_id', required: true, schema: { oneOf: [{ type: 'string' }] } })
  deleteProfileImage(@Req() req: RequestWithUser) {
    return this.profileService.deleteprofileimage(req.user.uid);

  }
  @UseGuards(AuthGuard('jwt'))
  @Delete('/cover')
  @ApiOperation({ summary: 'Delete Cover image' })
  // @ApiParam({ name: 'profile_id', required: true, schema: { oneOf: [{ type: 'string' }] } })
  deleteCoverImage(@Req() req: RequestWithUser) {
    return this.profileService.deletecoverimage(req.user.uid);

  }



  // CONNECTION CREATION //status= "invite","connected"

  @Post('/:id/invite')
  @ApiOperation({ summary: 'Invite other' })
  @ApiParam({ name: 'id', required: true, schema: { oneOf: [{ type: 'string' }] } })
  Invite(@Param() param: any, @Body() body: ConnectionDto) {
    return this.profileService.connectioninvite(param.id, body.profile_id);
  }
  @Delete('/:id/cancel')
  @ApiOperation({ summary: 'Cancel Invite' })
  @ApiParam({ name: 'id', required: true, schema: { oneOf: [{ type: 'string' }] } })
  Cancel(@Param() id: string, @Body() body: ConnectionDto) {
    return this.profileService.connectioncancel(id, body.profile_id);
  }

  @Post('/:id/connect')
  @ApiOperation({ summary: 'Connect' })
  @ApiParam({ name: 'id', required: true, schema: { oneOf: [{ type: 'string' }] } })
  Accept(@Param() id: string, @Body() body: ConnectionDto) {
    console.log(id)
    console.log(body)
    return this.profileService.connectionaccept(id, body.profile_id);
  }
  @Delete('/:id/disconnect')
  @ApiOperation({ summary: 'Disconnect' })
  @ApiParam({ name: 'id', required: true, schema: { oneOf: [{ type: 'string' }] } })
  Disconnect(@Param() id: string, @Body() body: ConnectionDto) {
    console.log(id)
    console.log(body)
    return this.profileService.connectiondisconnect(id, body.profile_id);
  }


  // Experience
  @UseGuards(AuthGuard('jwt'))
  @Post('/experience')
  @ApiOperation({ summary: 'Add Experience' })
  // @ApiParam({ name: 'profile_id', required: true, schema: { oneOf: [{ type: 'string' }] } })
  AddExperience(@Req() req: RequestWithUser, @Body() experienceDto: ExperienceDto) {
    console.log("hi")
    return this.profileService.addExperience(req.user.uid, experienceDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('/experience/:experience_id')
  @ApiOperation({ summary: 'Update Experience' })
  // @ApiParam({name: 'profile_id', required: true, schema: { oneOf: [{type: 'string'}]}})
  @ApiParam({ name: 'experience_id', required: true, schema: { oneOf: [{ type: 'string' }] } })
  UpdateExperience(@Param() param: any, @Body() experienceDto: ExperienceDto) {
    return this.profileService.updateExperience(param.experience_id, experienceDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/experience/:experience_id')
  @ApiOperation({ summary: 'Delete Experience' })
  @ApiParam({ name: 'experience_id', required: true, schema: { oneOf: [{ type: 'string' }] } })
  DeleteExperience(@Param() param: any) {
    return this.profileService.deleteExperience(param.experience_id);
  }




}
