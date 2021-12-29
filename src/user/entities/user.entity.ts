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

    @Column({default: 'ghost'})
    type: string;

    @Column()
    status: string;
  
    @CreateDateColumn()
    createdAt: Date;

    @OneToOne(() => Profile)
    @JoinColumn()
    profile: Profile;
 
  }