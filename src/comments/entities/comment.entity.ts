import User from 'src/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Posts } from 'src/posts/entity/post.entity';
import Profile from 'src/profile/entities/profile.entity';
import { profile } from 'console';

@Entity('Comments')
export class Comments {

  @PrimaryColumn()
  comment_id: string;

  @Column()
  body: string;


  @ManyToOne(() => Posts, (post) => post.comments,{nullable:false, onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  @JoinColumn()
  post: Posts;

  @ManyToOne(() => Profile, (profile) => profile.comments,{nullable:false, onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  @JoinColumn()
  profile: Profile;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({select: false})
  editedAt?: Date;

}

