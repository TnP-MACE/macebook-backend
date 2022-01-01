import { Injectable, NotFoundException, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Any, Connection, In, Repository } from 'typeorm';
import { Posts } from './entity/post.entity';
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

  async getallposts_by_profile(uid: string, id: any): Promise<any> {

    console.log(id)
    const profile = await this.profilerepository.find({ where: { profile_id: id } });
    const posts = await this.postrepository.createQueryBuilder("Posts").where("Posts.profileProfileId = :profile_id", { profile_id: id.id }).getMany();
    console.log(posts)
    return posts;
  }

  async getsinglepost(post_id: string): Promise<Posts> {
    console.log(post_id)
    const post = await this.postrepository.findOne(post_id);
    console.log(post)
    if (!post) {
      throw new NotFoundException();
    }
    return post;
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

  async insertpost(data: PostsDto, user_id: string): Promise<any> {
    console.log(data)
    try {

      const user = await this.userrepository.findOne({ where: { uid: user_id } })
      const name = user.username
      console.log(user)
      const profile = await this.profilerepository.findOne({ where: { profile_id: user_id } })
      console.log(profile)
      const { text } = data;
      const profile_image_name = profile.profile_image_url
      const post = this.postrepository.create({
        text,
        likes: [],
        comments: [],
      })
      post.profile = profile;
      post.post_username = name
      post.post_profile_image_name = profile_image_name
      post.post_profile_id = user_id
      await this.postrepository.save(post);
      return {
        post,
        user_id,
        sucess: true,
        message: 'post is uploded',
      };
    } catch (err) {
      console.log(err, 'err');
      return {
        sucess: false,
        message: 'post is not uploaded'
      };
    }
  }

  async updatepost(post_id: string, updatepostdto: UpdatePostDto): Promise<any> {
    console.log(updatepostdto);
    try {
      const { text } = updatepostdto;
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

  async uploadpostphoto(post: any, image_name: string, user_id: string): Promise<any> {
    try {
      const profile = await this.profilerepository.findOne({ where: { profile_id: user_id } });
      var user = {
        post_id: post.post_id,
        post_image_name: image_name,
        profile: profile
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
  
  async deletepostimage(post_id: any): Promise<any> {
    try {
      var postdata = await this.postrepository.findOne(post_id);
      console.log(postdata);
      var filename = postdata.post_image_name
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
  
  async updatepostimage(post_id: any, image_name: string): Promise<any> {

    try {
      var postdata = await this.postrepository.findOne(post_id);
      console.log(post_id);
      var filename = postdata.post_image_name

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

}
