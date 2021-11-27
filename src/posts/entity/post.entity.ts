import { Comments } from 'src/comments/entities/comment.entity';
import Profile from 'src/profile/entities/profile.entity';
import  User  from "src/user/entities/user.entity";
import {
    Entity,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Unique,
    PrimaryColumn,
    PrimaryGeneratedColumn,
    OneToMany,
    ManyToOne

} from 'typeorm';


@Entity()
export class Posts {
    @PrimaryGeneratedColumn('uuid')
    post_id:string;

    @CreateDateColumn()
    createdDate:Date;



    @Column({ length:512 })
    text:string;

    @Column({ type: 'simple-array' })
    likes: string[];

    @Column({nullable:true  })
    post_image_name: string;

    @Column({nullable:true})
    post_username:string



    //Post-Comment(AR)
    @OneToMany(() => Comments, (comments) => comments.post)
    comments: Comments[];

    //POST-PROFILE CONNECTION
    @ManyToOne(() => Profile, (profile) => profile.posts)
    profile: Profile;

}