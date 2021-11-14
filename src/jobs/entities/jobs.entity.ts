import {
    Entity,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    Unique,
    PrimaryColumn,
  } from 'typeorm';
  import Applications from './applications.entity';
  @Entity('Jobs')
  // @Unique(['job_id'])
  export default class Jobs {
    @PrimaryColumn()
    job_id: string;                            //job id
    
    @Column()
    uid: string;                               //user id

    @Column()
    job_name: string;
  
    @Column()
    company_name: string;

    @Column("simple-json",{nullable:true})
    address:{ state: string,city:string, country: string };

    @Column({ type: 'simple-array',nullable:true })
    job_type: string[];

    @Column({ type: 'simple-array',nullable:true })
    skills: string[];
   
    @Column()
    job_description: string;               //linkedIn model

    @Column()
    salary: string;                   //linkedIn model

    @Column()
    domain: string; 

    @CreateDateColumn()
    createdAt: Date;
    @UpdateDateColumn({nullable:true})
    editedAt?: Date;

    @OneToMany(() => Applications, (applications) => applications.jobs,{nullable:true})
    applications: Applications[];//We try to connect others

  }