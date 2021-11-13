import { Body, Controller, Delete, Get, Param, Patch, Post, Req } from '@nestjs/common';
import RequestWithUser from 'src/user/interfaces/requestWithUser.interface';
import { CommentsService } from './comments.services';
import { CommentsDto } from './dto/comment.dto';

//POST USER AND COMMENTS are connected



@Controller("api/v1/comments")
export class CommentsController {
  constructor(private readonly commentService: CommentsService) {
  }
  @Get('p1/:post_id')//Post with comments
getpostandcomment(@Param() post_id:string):Promise<any>{
    
    return this.commentService.getpostandcomments(post_id);
}
@Get('p/:post_id')//Get comments only for post_id
getAllComments(@Param() post_id:string):Promise<any>{
    return this.commentService.getcommentsofpost(post_id);
}

@Get('p2')//Get post with counts of comments
getAllpostwithCommentcounts(@Param() post_id:string):Promise<any>{


    return this.commentService.getpostsandcommentscount();
}

@Get('p3')//NOT COMPLETE-----Get post with some comments like the instagram post ui 
getAllpostwithSomeComments(@Param() post_id:string):Promise<any>{


    return this.commentService.getpostsandsomecomments();
}
@Post(':post_id')// Post comments
postcomment(@Param() post_id:string,@Req() req:RequestWithUser,@Body() data:any):Promise<any>{
    return this.commentService.insertcomment(data,post_id,req.user.uid);
}

@Patch(':comment_id')// Update comment
updatecomments(@Param() comment_id:string,@Body() data:any):Promise<any>{
    return this.commentService.updatecomment(comment_id,data);
}

@Delete(':comment_id')//Delete comment with id
delete(@Param() comment_id):Promise<any>{
    
    return this.commentService.deletecomment(comment_id);
}

}