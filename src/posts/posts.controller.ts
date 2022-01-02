import { Body, Controller, Get, Param, Post, Patch, Delete, Req, UploadedFile, Query, UseInterceptors, UseGuards, Res } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsDto } from './dto/create-post.dto'
import { UpdatePostDto } from './dto/update-post.dto';
import { GetPostByTopic } from './dto/get-post-by-topic.dto';
import {FileInterceptor} from '@nestjs/platform-express';
import RequestWithUser from 'src/user/interfaces/requestWithUser.interface';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('Posts')
@ApiBearerAuth()
@Controller('api/v1/posts')
export class PostsController {
  constructor(private readonly postservice: PostsService) {
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  getallposts(): Promise<any> {
    return this.postservice.getallposts();
  }

  @Get('/profile_posts/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiParam({ name: 'id', required: true, schema: { oneOf: [{ type: 'string' }] } })
  getallposts_by_profile(@Req() req: RequestWithUser, @Param() id: string): Promise<any> {
    return this.postservice.getallposts_by_profile(req.user.uid, id);
  }

  @Get('/:post_id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Search Post' })
  @ApiParam({ name: 'post_id', required: true, schema: { oneOf: [{ type: 'string' }] } })

  SinglePost(@Param() post_id: string): Promise<any> {
    return this.postservice.getsinglepost(post_id)
  }

 

  @UseGuards(AuthGuard('jwt'))
  @Post('/add_post')
  InsertPost(@Body() postdto: PostsDto, @Req() req: RequestWithUser): Promise<any> {
    return this.postservice.insertpost(postdto, req.user.uid)
  }

  @Patch('/update_post/:post_id')
  @UseGuards(AuthGuard('jwt'))
  UpdatePost(@Param('post_id') post_id: string, @Body() updatepostdto: UpdatePostDto): Promise<any> {
    return this.postservice.updatepost(post_id, updatepostdto)
  }

  @Delete('/:post_id')
  @UseGuards(AuthGuard('jwt'))
  DeletePost(@Param() post_id: string): Promise<any> {
    return this.postservice.deletepost(post_id)
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/like/:id')
  @ApiOperation({ summary: 'Like post ' })
  @ApiParam({ name: 'id', required: true, schema: { oneOf: [{ type: 'string' }] } })
  likepost(@Req() req: RequestWithUser, @Param() params): Promise<any> {
    return this.postservice.likepost(params.id, req.user.uid);

  }

  // POST IMAGES
  @UseGuards(AuthGuard('jwt'))
  @Post('/picture/:post_id')
  @ApiOperation({ summary: 'Upload post image' })
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
  @UseInterceptors(FileInterceptor('postimage'))
  uploadImage(@Param() post_id: string, @UploadedFile() file: Express.Multer.File, @Req() req: RequestWithUser) {
    return this.postservice.uploadpostphoto( req.user.uid,post_id, file.buffer, file.originalname);
  }

  //DELETE POST IMAGE
  @UseGuards(AuthGuard('jwt'))
  @Delete('/picture/:post_id')
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
    return this.postservice.deletepostimage(post_id);
  }

  //GET IMAGES
  @Get('/images/:id')
  @ApiOperation({ summary: 'Get image by id' })
  @ApiParam({ name: 'id', required: true, schema: { oneOf: [{ type: 'string' }] } })
  FindImage(@Param() param:any, @Res() res:any) {
    const readStream = this.postservice.getImage(param.id)
    readStream.pipe(res)
  }

    // // UPDATE POST IMAGE
    // @UseGuards(AuthGuard('jwt'))
    // @Patch('/picture/:post_id')
    // @ApiOperation({ summary: 'Update post image' })
    // @ApiParam({ name: 'post_id', required: true, schema: { oneOf: [{ type: 'string' }] } })
    // @ApiConsumes('multipart/form-data')
    // @ApiBody({
    //   schema: {
    //     type: 'object',
    //     properties: {
    //       postimage: {
    //         type: 'string',
    //         format: 'binary',
    //       },
    //     },
    //   },
    // })
    // @UseInterceptors(FileInterceptor('postimage', {
    //   storage: diskStorage({
    //     destination: './uploads/post',
    //     filename: (req, file, cb) => {
    //       const fileName = uuidv4();
    //       return cb(null, `${fileName}${extname(file.originalname)}`);
    //     }
    //   })
    // }))
    // updateImage(@Param() post_id: string, @UploadedFile() file: Express.Multer.File, @Req() req: any) {
    //   return this.postservice.updatepostimage(post_id, file.filename);
    // }
}