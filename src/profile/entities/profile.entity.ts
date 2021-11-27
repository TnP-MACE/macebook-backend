import { Comments } from 'src/comments/entities/comment.entity';
import { Posts } from 'src/posts/entity/post.entity';
import User from 'src/user/entities/user.entity';
import {
  Entity,
  PrimaryColumn,
  Column,
  OneToMany,
  OneToOne,
  JoinColumn
} from 'typeorm';
import Applications from '../../jobs/entities/applications.entity';
import Connections from './connections.entity';
import Experience from './experience.entity';
import Skills from './skills.entity';


@Entity('Profile')
export default class Profile {
  @PrimaryColumn({ unique: true })
  profile_id: string;

  @Column({ length: 100,nullable: true })
  fullname: string;

  @Column("simple-json",{nullable:true})
  admission:{ admission_no: string,branch:string, batch: string };

  @Column({ length: 15, nullable: true })
  phoneno: string;

  @Column("simple-json",{nullable:true})
  urls:{ personal_url:string, linkedin: string, facebook: string,github: string };

  @Column({ length: 1024, nullable: true })
  about: string;

  @Column({ length: 20, default: "incomplete" })
  status: string;

  @Column("simple-json",{nullable:true})
  address:{ place:string, district: string, state: string,country: string };

  // @Column({nullable: true})
  // utype: string;              //alumini or student

  @Column({ nullable: true })
  profile_image_url: string;

  @Column({ nullable: true })
  cover_url: string;

  @Column({ nullable: true })
  ref_fullname: string;

  @Column({ nullable: true })
  ref_email: string;

  @Column({ nullable: true })
  ref_phonenumber: string;

  @OneToMany(() => Skills, (skills) => skills.profile)
  skills: Skills[];


  @Column({ type: 'simple-array',nullable:true })
  accomplishments: string[];

  @OneToMany(() => Connections, (connection) => connection.connection_memberid,{nullable:true})
  connections: Connections[];//Our connectinos

  @OneToMany(() => Connections, (connection) => connection.member_id,{nullable:true})
  secondaryconnections: Connections[];//Others who try to connect us

  @OneToMany(() => Experience, (experience) => experience.profile,{nullable:true})
  experience: Experience[];

  //connection on posts and profile
  @OneToMany(()=>Posts, (post)=>post.profile)
    posts:Posts[]
  
  //connection on post and profile
  @OneToMany(()=>Comments, (comment)=>comment.profile)
  comments:Comments[]

  @OneToOne(() => User, user => user.profile) // specify inverse side as a second parameter
    user: User;
  
    @OneToMany(()=>Applications, (applications)=>applications.profile,{nullable:false})
    applications:Applications[]

}
export class ProfileSwagger extends Profile {}

