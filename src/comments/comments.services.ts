import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {Comments} from './entities/comment.entity'
import { v4 as uuidv4 } from 'uuid';
import { Posts } from "src/posts/entity/post.entity";
import User from "src/user/entities/user.entity";
import Profile from "src/profile/entities/profile.entity";
import { profile } from "console";

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comments)
    private readonly commentRepository: Repository<Comments>,
    @InjectRepository(Posts)
    private readonly postRepository:Repository<Posts>,
    @InjectRepository(Profile)
    private readonly profileRepository:Repository<Profile>,
    @InjectRepository(User)
    private readonly userRepository:Repository<User>

  ) { }
  async insertcomment(data: any,post_id: string,user_id:string): Promise<any> {

    console.log(user_id)

    try {
      const post = await this.postRepository.findOne(post_id)
      const user = await this.userRepository.findOne({ where: { uid: user_id} })
      const profile=await this.profileRepository.findOne({where:{profile_id:user_id}})
      
      if (post != null && user != null) {
        const comment= new Comments();
        comment.comment_id = uuidv4();
        comment.profile=profile;
        comment.post = post;  
        comment.body = data.body;
        console.log(comment)
        await this.commentRepository.save(comment);

        return {
          success: true,
          message: 'Comment added'
        };
      }
      else if (post == null) {
        return {
          success: false,
          message: 'No such post exist'
        };
      } else if (user == null) {
        return {
          success: false,
          message: 'You(user) doest exist'
        };
      }
    } catch (err) {
      console.log('err', err);
      return {
        success: false,
        message: 'comment is not added'
      };
    }
  }

  async deletecomment(comment_id: string): Promise<any> {
    try {
      const result = await this.commentRepository.createQueryBuilder('e').delete().where(comment_id ).execute();
      console.log(result)
      if (result?.affected !== 1) {
        throw new NotFoundException();
      }
      else {
        return {
          success: true,
          message: 'comment is deleted'
        }
      }

    } catch (err) {
      return {
        success: false,
        message: 'comment is not deleted'
      }
    }
  }


  async getpostandcomments(post_id:string):Promise<any>{

    try{
        var post =await this.postRepository.createQueryBuilder("post").leftJoinAndSelect("post.comments", "comments")
        .leftJoin("comments.user", "user").addSelect("user.username").addSelect("user.uid").getOne()
    
    return{
        post
    };
 }catch(err){
     console.log('err',err);
     return{
         success:false,
         message:'comment not obtained'
     };
    }}
    async getpostsandcommentscount():Promise<any>{

        try{
            // var post =await this.postRepository.createQueryBuilder("post").leftJoinAndSelect("post.comments","Comments").getMany()
            var post =await this.postRepository.createQueryBuilder("post").loadRelationCountAndMap('post.commentsCount', 'post.comments').getMany()

        //  var comments=await this.commentRepository.find({where:{post}})
        
        return post
    
     }catch(err){
         console.log('err',err);
         return{
             success:false,
             message:'comment not obtained'
         };
        }}async getpostsandsomecomments():Promise<any>{

          try{
              var post =await this.postRepository.createQueryBuilder("post").leftJoinAndSelect(subQuery=>{return subQuery},"comments")
              .leftJoin("comments.user", "user").addSelect("user.username").addSelect("user.uid").getMany()
  
          return post
      
       }catch(err){
           console.log('err',err);
           return{
               success:false,
               message:'comment not obtained'
           };
          }}
   async getcommentsofpost(post_id:string):Promise<any>{

    try{
        var post =await this.postRepository.findOne(post_id)
     var comments=await this.commentRepository.find({where:{post}})
    
    return{
        comment:comments
    };
 }catch(err){
     console.log('err',err);
     return{
         success:false,
         message:'comment not obtained'
     };
    }}
  
  
   
    
    async updatecomment(comment_id:string,data:any):Promise<any>{
        try{
            
           
            const result=await this.commentRepository.createQueryBuilder('s').update(Comments).set({body: data.body}).where(comment_id).execute();
            if(result?.affected !==1){
                return{
                    success:false,
                    message:'comment is not updated'
                }
            }
            else{
                return{
                    success:true,
                    message:'comment is updated'
                }
            }
            
        }catch(err){
            return{
                success:false,
                message:'comment is not updated'
            }
        }}

}