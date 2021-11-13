import Profile from 'src/profile/entities/profile.entity';
import {
    Entity,
    Column,
    CreateDateColumn,
    Unique,
    OneToOne,
    JoinColumn,
    PrimaryGeneratedColumn
  } from 'typeorm';

  export enum UserType {
    STUDENT = "student",
    ALUMNUS = "alumnus",
    GHOST = "ghost"
  }

  @Entity('User')
  @Unique(['email','username'])
  export default class User {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    uid: string;

    @Column({unique:true})
    username: string;
  
    @Column ({ length: 128, unique:true })
    email: string;
  
    @Column({ length: 128 })
    password: string;

    @Column({default: UserType.GHOST})
    type: UserType;

    @Column()
    status: string;
  
    @CreateDateColumn()
    createdAt: Date;

    @OneToOne(() => Profile)
    @JoinColumn()
    profile: Profile;
 
  }