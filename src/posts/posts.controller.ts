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
@Controller('api/v1/posts')
export class PostsController {
    constructor (private readonly postservice:PostsService){
    }

    @Get()
    getallposts():Promise<any>{
        return this.postservice.getallposts();
    }

    @Get('/search')
    searchpost(@Query() topicdto:GetPostByTopic):Promise<any>{
        return this.postservice.searchpost(topicdto)
    }

    @Get('/topic')
    getpostbytopic(@Query() topicdto:GetPostByTopic):Promise<any>{
        return this.postservice.getpostbytopic(topicdto)
    }

    @Get('/:post_id')
    SinglePost(@Param() post_id:string):Promise<any>{
        return this.postservice.getsinglepost(post_id)
    }

    @Post('/add_post')
    InsertPost(@Body() postdto:PostsDto): Promise <any> {
        return this.postservice.insertpost(postdto)
    }

    @Patch('/:post_id/update_post')
    UpdatePost(@Param('post_id') post_id:string,@Body() updatepostdto:UpdatePostDto):Promise<any>{
        return this.postservice.updatepost(post_id,updatepostdto)
    }

    @Delete('/:post_id')
    DeletePost(@Param() post_id:string):Promise<any>{
        return this.postservice.deletepost(post_id)
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('/like:id')
    likepost(@Req() req:RequestWithUser,@Param() params):Promise<any>{
        return this.postservice.likepost(params.id,req.user.uid);

    }

      // PROFILE AND COVER IMAGES
      @Post('/picture/:post_id')
      @UseInterceptors(FileInterceptor('postimage', {
          storage: diskStorage({
              destination: './uploads/post',
              filename: (req, file, cb) => {
                  const fileName = uuidv4();
                  return cb(null, `${fileName}${extname(file.originalname)}`);
              }
          })
      }))
      uploadImage(@Param() post_id: string, @UploadedFile() file: Express.Multer.File, @Req() req: any) {
        return this.postservice.uploadpostphoto(post_id, file.filename);
      }

      @Patch('/picture/:post_id')
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

      @Delete('/picture/:post_id')
        deletepostimage(@Param() post_id: string) {
        console.log("sd")
        return this.postservice.deletepostimage(post_id);

    }

      

   
    

    

}

