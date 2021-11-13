import { Comments } from 'src/comments/entities/comment.entity';
import { Posts } from 'src/posts/entity/post.entity';
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    Unique,
    OneToMany,
  } from 'typeorm';
  @Entity('User')
  @Unique(['email'])
  export default class User {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    uid: string;

    @Column({unique:true})
    username: string;
  
    @Column({ length: 128, unique:true })
    email: string;
  
    @Column({ length: 128 })
    password: string;
  
    @Column()
    status: string;
  
    @CreateDateColumn()
    createdAt: Date;
    
    @OneToMany(()=>Comments, (comment)=>comment.user)
    comments:Comments[]


    //CONNECTION WITH POST MODULE
    @OneToMany(()=>Posts, (post)=>post.user)
    posts:Posts[]

    
  }