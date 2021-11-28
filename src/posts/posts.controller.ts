import { Body, Controller, Get ,Param, Post, Patch, Delete,Req, UploadedFile,Query,UseInterceptors, UseGuards} from '@nestjs/common';
import {PostsService} from './posts.service';
import { PostsDto } from './dto/create-post.dto'
import { UpdatePostDto } from './dto/update-post.dto';
import { GetPostByTopic } from './dto/get-post-by-topic.dto';
import { v4 as uuidv4 } from 'uuid';
import { diskStorage } from 'multer';
import path, { extname } from 'path';
import { AnyFilesInterceptor, FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { get } from 'http';
import RequestWithUser from 'src/user/interfaces/requestWithUser.interface';
import jwtAuthenticationGuard from 'src/user/guards/jwt-auth.guard'
import localAuthenticationGuard from 'src/user/guards/local-auth.guard'
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('POSTS')
@Controller('api/v1/posts')
export class PostsController {
    constructor (private readonly postservice:PostsService){
    }

    @Get()
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    getallposts():Promise<any>{
        return this.postservice.getallposts();
    }
    
    @Get('/profile_posts')
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    getallposts_by_profile(@Req() req:RequestWithUser):Promise<any>{
        return this.postservice.getallposts_by_profile(req.user.uid);
    }

    @Get('/search')
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    searchpost(@Query() topicdto:GetPostByTopic):Promise<any>{
        return this.postservice.searchpost(topicdto)
    }

    @Get('/topic')
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    getpostbytopic(@Query() topicdto:GetPostByTopic):Promise<any>{
        return this.postservice.getpostbytopic(topicdto)
    }

    @Get('/:post_id')
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Search Post' })
    @ApiParam({ name: 'post_id', required: true, schema: { oneOf: [{ type: 'string' }] } }) 
    
    SinglePost(@Param() post_id:string):Promise<any>{
        return this.postservice.getsinglepost(post_id)
    }

/*     @UseGuards(AuthGuard('jwt'))
    @Post('/add_post')
    @ApiBearerAuth()
    InsertPost(@Body() postdto:PostsDto,@Req() req:RequestWithUser): Promise <any> {
        return this.postservice.insertpost(postdto,req.user.uid)
    }
 */

    @UseGuards(AuthGuard('jwt'))
    @Post('/add_post')
    @ApiBearerAuth()
    @ApiConsumes('multipart/form-data')
      @ApiBody({
        schema: {
          type: 'object',
          properties: {
            postimage: {
              type: 'string',
              format: 'binary',
            },
          },
        },
      })
    @UseInterceptors(FileInterceptor('postimage', {
      storage: diskStorage({
          destination: './uploads/post',
          filename: (req, file, cb) => {
              const fileName = uuidv4();
              return cb(null, `${fileName}${extname(file.originalname)}`);
          }
      })
  }))
    InsertPost(@Body() postdto:PostsDto,@Req() req:RequestWithUser, @UploadedFile() file: Express.Multer.File): Promise <any> {
      console.log(postdto)
        return this.postservice.insertpost(postdto,req.user.uid,file.filename)
    }


    @Patch('/update_post/:post_id')
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    UpdatePost(@Param('post_id') post_id:string,@Body() updatepostdto:UpdatePostDto):Promise<any>{
        return this.postservice.updatepost(post_id,updatepostdto)
    }

    @Delete('/:post_id')
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    DeletePost(@Param() post_id:string):Promise<any>{
        return this.postservice.deletepost(post_id)
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('/like/:id')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Like post ' })
      @ApiParam({ name: 'id', required: true, schema: { oneOf: [{ type: 'string' }] } })
    likepost(@Req() req:RequestWithUser,@Param() params):Promise<any>{
        return this.postservice.likepost(params.id,req.user.uid);

    }

      // POST IMAGES
      @UseGuards(AuthGuard('jwt'))
      @Post('/picture/:post_id')
      @ApiOperation({ summary: 'Upload post image' })
      @ApiBearerAuth()
      @ApiParam({ name: 'post_id', required: true, schema: { oneOf: [{ type: 'string' }] } })
     @ApiConsumes('multipart/form-data')
      @ApiBody({
        schema: {
          type: 'object',
          properties: {
            postimage: {
              type: 'string',
              format: 'binary',
            },
          },
        },
      })
      @UseInterceptors(FileInterceptor('postimage', {
          storage: diskStorage({
              destination: './uploads/post',
              filename: (req, file, cb) => {
                  const fileName = uuidv4();
                  return cb(null, `${fileName}${extname(file.originalname)}`);
              }
          })
      }))
      uploadImage(@Param() post_id: string, @UploadedFile() file: Express.Multer.File, @Req() req: RequestWithUser) {
        return this.postservice.uploadpostphoto(post_id, file.filename,req.user.uid);
      }

      // UPDATE POST IMAGE
      @UseGuards(AuthGuard('jwt'))
      @Patch('/picture/:post_id')
      @ApiBearerAuth()
      @ApiOperation({ summary: 'Update post image' })
      @ApiParam({ name: 'post_id', required: true, schema: { oneOf: [{ type: 'string' }] } })
     @ApiConsumes('multipart/form-data')
      @ApiBody({
        schema: {
          type: 'object',
          properties: {
            postimage: {
              type: 'string',
              format: 'binary',
            },
          },
        },
      })
      @UseInterceptors(FileInterceptor('postimage', {
          storage: diskStorage({
              destination: './uploads/post',
              filename: (req, file, cb) => {
                  const fileName = uuidv4();
                  return cb(null, `${fileName}${extname(file.originalname)}`);
              }
          })
      }))
      updateImage(@Param() post_id: string, @UploadedFile() file: Express.Multer.File, @Req() req: any) {
          return this.postservice.updatepostimage(post_id, file.filename);
      }

      //DELETE POST IMAGE
      @UseGuards(AuthGuard('jwt'))
      @Delete('/picture/:post_id')
      @ApiBearerAuth()
      @ApiOperation({ summary: 'delete post image' })
      @ApiParam({ name: 'post_id', required: true, schema: { oneOf: [{ type: 'string' }] } })
     @ApiConsumes('multipart/form-data')
      @ApiBody({
        schema: {
          type: 'object',
          properties: {
            postimage: {
              type: 'string',
              format: 'binary',
            },
          },
        },
      })
        deletepostimage(@Param() post_id: string) {
        console.log("sd")
        return this.postservice.deletepostimage(post_id);

    }

      

   
    

    

}

