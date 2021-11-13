import { Comments } from 'src/comments/entities/comment.entity';
import { Posts } from 'src/posts/entity/post.entity';
import Profile from 'src/profile/entities/profile.entity';
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    Unique,
    OneToMany,
    PrimaryColumn,
    OneToOne,
    JoinColumn
  } from 'typeorm';

  export enum UserType {
    STUDENT = "student",
    ALUMNUS = "alumnus",
    GHOST = "ghost"
  }

  @Entity('User')
  @Unique(['email'])
  export default class User {
    // @PrimaryGeneratedColumn()
    // id: number;
    
    @Column()
    uid: string;

    @Column({unique:true})
    username: string;
  
    @PrimaryColumn ({ length: 128, unique:true })
    email: string;
  
    @Column({ length: 128 })
    password: string;

    @Column({default: UserType.GHOST})
    type: string;

    @Column()
    status: string;
  
    @CreateDateColumn()
    createdAt: Date;

    @OneToOne(() => Profile)
    @JoinColumn()
    profile: Profile;
 
  }