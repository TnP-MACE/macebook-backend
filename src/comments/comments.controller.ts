import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import RequestWithUser from 'src/user/interfaces/requestWithUser.interface';
import { CommentsService } from './comments.services';
import { CommentsDto } from './dto/comment.dto';
import { CommentPostDto } from './dto/comment-post.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
//POST USER AND COMMENTS are connected

@ApiTags('Comments')
@Controller("api/v1/comments")
export class CommentsController {
  constructor(private readonly commentService: CommentsService) {
  }
  @Get('p1/:post_id')//Post with comments
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Post with comments' })
  @ApiParam({ name: 'post_id', required: true, schema: { oneOf: [{ type: 'string' }] } })
getpostandcomment(@Param() post_id:string):Promise<any>{
    
    return this.commentService.getpostandcomments(post_id);
}
@Get('p/:post_id')//Get comments only for post_id
@UseGuards(AuthGuard('jwt'))
@ApiOperation({ summary: 'Get comments only for post_id' })
  @ApiParam({ name: 'post_id', required: true, schema: { oneOf: [{ type: 'string' }] } })
getAllComments(@Param() post_id:string):Promise<any>{
    return this.commentService.getcommentsofpost(post_id);
}

@Get('p2')//Get post with counts of comments
@UseGuards(AuthGuard('jwt'))
@ApiOperation({ summary: 'Get post with counts of comments' })
  @ApiParam({ name: 'post_id', required: true, schema: { oneOf: [{ type: 'string' }] } })
getAllpostwithCommentcounts(@Param() post_id:string):Promise<any>{


    return this.commentService.getpostsandcommentscount();
}

@Get('p3')//NOT COMPLETE-----Get post with some comments like the instagram post ui
@UseGuards(AuthGuard('jwt')) 
@ApiOperation({ summary: 'Search Post' })
  @ApiParam({ name: 'post_id', required: true, schema: { oneOf: [{ type: 'string' }] } })
getAllpostwithSomeComments(@Param() post_id:string):Promise<any>{


    return this.commentService.getpostsandsomecomments();
}
@Post(':post_id')// Post comments
@UseGuards(AuthGuard('jwt'))
@ApiOperation({ summary: 'Post comments' })
  @ApiParam({ name: 'post_id', required: true, schema: { oneOf: [{ type: 'string' }] } })
postcomment(@Param() post_id:string,@Req() req:RequestWithUser,@Body() commentpostdto:CommentPostDto):Promise<any>{
 
    console.log(req.user)
    return this.commentService.insertcomment(commentpostdto,post_id,req.user.uid);
}

@Patch(':comment_id')// Update comment
@UseGuards(AuthGuard('jwt'))
@ApiOperation({ summary: 'update comment' })
  @ApiParam({ name: 'comment_id', required: true, schema: { oneOf: [{ type: 'string' }] } })
updatecomments(@Param() comment_id:string,@Body() commentpostdto:CommentPostDto):Promise<any>{
    return this.commentService.updatecomment(comment_id,commentpostdto);
}

@Delete(':comment_id')//Delete comment with id
@UseGuards(AuthGuard('jwt'))
@ApiOperation({ summary: 'Delete Comment' })
  @ApiParam({ name: 'comment_id', required: true, schema: { oneOf: [{ type: 'string' }] } })
delete(@Param() comment_id):Promise<any>{
    
    return this.commentService.deletecomment(comment_id);
}

}