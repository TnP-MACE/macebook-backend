import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Any, In, Repository } from 'typeorm';
import { Posts } from './entity/post.entity';
import { v4 as uuidv4 } from 'uuid'
import { PostsDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { GetPostByTopic } from './dto/get-post-by-topic.dto';
import Profile from 'src/profile/entities/profile.entity';
import User from 'src/user/entities/user.entity';
const fs = require('fs')


@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Posts)
    private readonly postrepository: Repository<Posts>,
    @InjectRepository(Profile)
    private readonly profilerepository: Repository<Profile>,
    @InjectRepository(User)
    private readonly userrepository: Repository<User>


  ) { }


  async getallposts(): Promise<any> {
    const query = this.postrepository.createQueryBuilder('post');
    const posts = query.select().orderBy('post.createdDate', 'DESC').getMany()
    return posts;
  }

  async searchpost(topicdto: GetPostByTopic): Promise<any> {
    const query = this.postrepository.createQueryBuilder('post');
    const { search } = topicdto;

    if (search) {
      query.andWhere(
        'post.text LIKE :search OR post.topic LIKE :search', { search: `%${search}%` }
      );

    }

    const posts = await query.getMany();
    return posts;

  }
  async getpostbytopic(topicdto: GetPostByTopic): Promise<any> {
    const query = this.postrepository.createQueryBuilder('post');
    const { topic } = topicdto;
    if (topic) {
      query.andWhere('post.topic = :topic', { topic });
    }


    const posts = await query.getMany();
    return posts;

  }


  async getsinglepost(post_id: string): Promise<Posts> {
    const post = await this.postrepository.findOne(post_id);
    if (!post) {
      throw new NotFoundException();
    }
    return post;

  }

  async insertpost(data: PostsDto, user_id: string): Promise<any> {
    console.log(data)
    try {
      //const post = await this.postRepository.findOne(post_id)
      const user = await this.userrepository.findOne({ where: { uid: user_id } })
      const name=user.username
      console.log(user)
      const profile = await this.profilerepository.findOne({ where: { profile_id: user_id } })
      console.log(profile)
      const { text } = data;
      const post = this.postrepository.create({
        
        text,
        likes: [],
        comments: [],


      })
      post.profile = profile;
      post.post_username=name

      console.log(post)

      await this.postrepository.save(post);
      return {
        post,
        
        sucess: true,
        message: 'post ids uploded',
      };
    } catch (err) {
      console.log(err, 'err');
      return {
        sucess: true,
        message: 'post is uploaded'
      };

    }





  }

  async updatepost(post_id: string, updatepostdto: UpdatePostDto): Promise<any> {
    console.log(updatepostdto);
    try {
      const {  text } = updatepostdto;
      const post = await this.getsinglepost(post_id);
      
      post.text = text;
      await this.postrepository.save(post);


      return {
        post,
        success: true,
        message: 'Post is updated'
      };
    } catch (err) {
      console.log('err', err);
      return {
        success: false,
        message: 'post is not updated'
      };
    }

  }

  async deletepost(post_id: string): Promise<any> {
    try {

      const result = await this.postrepository.delete(post_id);
      if (result.affected === 0) {
        throw new NotFoundException(`Task with ID "${post_id}" not found`);
      }
      return {
        success: true,
        message: 'post deleted successfully'

      };


    } catch (err) {
      console.log('err', err);
      return {
        sucess: false,
        message: 'post is not deleted'


      }
    }

  }

  async likepost(post_id: string, user_id: string): Promise<any> {
    try {
      const post = await this.getsinglepost(post_id)
      if (post.likes.some(like => like === user_id)) {
        post.likes.splice(post.likes.indexOf(user_id), 1);
        return await this.postrepository.save(post)
      }
      else {
        post.likes.push(user_id);
        return await this.postrepository.save(post);
      }
    } catch (err) {
      throw (err)
    }



  }

  async uploadpostphoto(post: any, image_name: string,user_id:string): Promise<any> {
    try {
      const profile=await this.profilerepository.findOne({where:{profile_id:user_id}});
      var user = {
        post_id: post.post_id,
        post_image_name: image_name,
        profile:profile
      }
      await this.postrepository.save(user)
      return {
        success: true,
        message: 'post picture is  updated'
      }


    } catch (err) {
      console.log('err', err);
      return {
        success: false,
        message: 'Post image not inserted',
      };
    }

  }

  async updatepostimage(post_id: any, image_name: string): Promise<any> {

    try {
      var postdata = await this.postrepository.findOne(post_id);
      console.log(post_id);
      var filename = postdata.post_image_name
      /* var url_split = profile_image_url.split("/")
      var filename = url_split[url_split.length - 1] */
      //  console.log(`.../uploads/profile/${filename}`)
      try {
        fs.unlinkSync(`./uploads/post/${filename}`)
        //file removed
      } catch (err) {
        console.error(err)
      }
      var user = {
        post_id: postdata.post_id,
        post_image_name: image_name
      }

      await this.postrepository.save(user)

      return {
        success: true,
        message: 'post image is updated'
      }


    } catch (err) {
      console.log('err', err);
      return {
        success: false,
        message: 'post image is not inserted',
      };
    }





  }

  async deletepostimage(post_id: any): Promise<any> {
    try {
      var postdata = await this.postrepository.findOne(post_id);
      console.log(postdata);
      var filename = postdata.post_image_name
      /* var url_split = profile_image_url.split("/")
      var filename = url_split[url_split.length - 1] */
      //  console.log(`.../uploads/profile/${filename}`)
      try {
        fs.unlinkSync(`./uploads/post/${filename}`)
        //file removed
      } catch (err) {
        console.error(err)
      }
      /* var profiledatas = await this.postrepository.createQueryBuilder().update(Profile).set({ profile_image_url: null }).where("profile_id = :profile_id", { profile_id: profile.profile_id }).execute() */
      var user = {
        post_id: postdata.post_id,
        post_image_url: null

      }
      this.postrepository.save(user);
      return {
        success: true,
        message: 'Successfully deleted post image',
      };
    } catch (err) {
      console.log('err', err);
      return {
        success: false,
        message: 'post picture not delete',
      };
    }
  }



}
