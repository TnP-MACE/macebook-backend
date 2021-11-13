import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import Profile from './profile.entity';

@Entity('Skills')
@Unique(['profile', 'skill'])
export default class Skills {
      @PrimaryGeneratedColumn("uuid")
  skill_id: string;    

  // @Column()
  // profile_id: string;               //user id
  
  @ManyToOne(() => Profile, (profile) => profile.skills, { nullable: false, onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  @JoinColumn()
  profile: Profile;

  @Column()
  skill: string;
}