import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { getManager, Repository } from "typeorm";
import Jobs from './entities/jobs.entity'
import { v4 as uuidv4 } from 'uuid';
import Applications from './entities/applications.entity';
import Profile from '../profile/entities/profile.entity';
import { application } from 'express';

const fs = require('fs')
@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Jobs)
    private readonly jobsRepository: Repository<Jobs>,
    @InjectRepository(Applications)
    private readonly applicationsRepository: Repository<Applications>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) { }
  async getJobDetails(): Promise<any> {
    const job = await this.jobsRepository.find();
    return job;
  }

  async getOneJobDetails(job_id: string): Promise<any> {
    const job = await this.jobsRepository.find({ where: job_id });
    return job;
  }

  async insertjob(data: any): Promise<any> {

    console.log(data);

    try {
      console.log(data);
      data.job_id = uuidv4();
      await this.jobsRepository.save(data);

      return {
        success: true,
        message: 'Successfully inserted job',

      };
      // }

    } catch (err) {
      console.log('err', err);
      return {
        success: false,
        message: 'job not inserted',
      };
    }
  }

  // async updatejob(data: any): Promise<any> {
  //   try {

  //     await this.jobsRepository.save(data);

  //     return {
  //       success: true,
  //       message: 'Successfully updated job',

  //     };
  //     // }

  //   } catch (err) {
  //     console.log('err', err);
  //     return {
  //       success: false,
  //       message: 'job not updated',
  //     };
  //   }
  // }
  async deletejob(job_id: string): Promise<any> {
    try {

      await this.jobsRepository.delete(job_id)
      return {
        success: true,
        message: 'Successfully deleted',

      };

    } catch (err) {
      console.log('err', err);
      return {
        success: false,
        message: 'not deleted',
      };
    }
  }

  async searchJobDetails(data: any): Promise<any> {
    try {
      var sample="";
   

      const myArray=data.jobsearch.toLowerCase().split(" ");
      // for(var i=0;i<myArray.length;i++){
      //   if(i==myArray.length-1){
      //     sample+='job_name like'+' %'+myArray[i]+'% '+'or company_name like'+' %'+myArray[i]+'% '; 
      //   }else{
      //     sample+='job_name like'+' %'+myArray[i]+'% '+ 'or company_name like'+' %'+myArray[i]+'% and ';
      //   }
        
      // }
      // // const job = await this.jobsRepository.createQueryBuilder('Jobs').where(sample).getMany();
      // const job = await this.jobsRepository.createQueryBuilder('Jobs').where('job_name like :name ',{name:'%'+myArray[1]+'%'}).getMany();
      for(var i=0;i<myArray.length;i++){
        if(i==myArray.length-1){
          sample+=`LOWER(job_name) like '%`+myArray[i]+`%' `+`or LOWER(company_name) like '%`+myArray[i]+`%' `; 
          // sample+=`LOWER(fullname) like '%`+myArray[i]+`%' `; 
        }else{
          sample+=`LOWER(job_name) like '%`+myArray[i]+`%' `+`or LOWER(company_name) like '%`+myArray[i]+`%' or `; 
          // sample+=`LOWER(fullname) like '%`+myArray[i]+`%' or `;
        }}
        console.log(sample)
      const entityManager = getManager();
      const job = entityManager.query(`
      SELECT 
        *
      FROM "Jobs" where ${sample};`);

      // const job = entityManager.query(`
      // SELECT 
      //   *
      // FROM "Jobs" where ${sample};
      // `,myArray);
      return job;
      // }

    } catch (err) {
      console.log('err', err);
      return {
        success: false,
        message: 'Job not fetched while searching',
      };
    }
  }
  // async getProfileDetails(key:string): Promise<any> {
  //   var sample="";
   

  //     const myArray=key.toLowerCase().split(" ");
      // for(var i=0;i<myArray.length;i++){
      //   if(i==myArray.length-1){
      //     sample+='job_name like'+' %'+myArray[i]+'% '+'or company_name like'+' %'+myArray[i]+'% '; 
      //   }else{
      //     sample+='job_name like'+' %'+myArray[i]+'% '+ 'or company_name like'+' %'+myArray[i]+'% and ';
      //   }
        
      // }
      // // const job = await this.jobsRepository.createQueryBuilder('Jobs').where(sample).getMany();
      // const job = await this.jobsRepository.createQueryBuilder('Jobs').where('job_name like :name ',{name:'%'+myArray[1]+'%'}).getMany();
      // for(var i=0;i<myArray.length;i++){
      //   if(i==myArray.length-1){
      //     sample+=`LOWER(fullname) like '%`+myArray[i]+`%' `; 
      //   }else{
      //     sample+=`LOWER(fullname) like '%`+myArray[i]+`%' or `;
      //   }}
      //   console.log(sample)
      // const entityManager = getManager();
      // const profile =  await entityManager.query(`
      // SELECT 
      //   profile_id, fullname
      // FROM "Profile" where ${sample};
      // `);
// console.log(profile)
//     // const profile = await this.profileRepository.find();
//     return profile;
//   }
  async AlumniJobDetails(alumni_id:string): Promise<any> {
    console.log(alumni_id)
    const entityManager = getManager();
    // const job=entityManager.query(`select * from "Jobs" where uid;`,alumni_id)
    // const job = await this.jobsRepository.createQueryBuilder('Jobs').leftJoin("Applications").a.where('uid= :alumni_id ',{alumni_id:alumni_id}).getMany();
//     const job = entityManager.query(`
//     SELECT j.*,count(select a.* from Applications a where a.job_id = j.job_id ) as c  from  "Jobs" j
// WHERE j.uid = $1
//     `,[alumni_id]);


//     return job;
    // var profile = await this.jobsRepository.createQueryBuilder("Jobs").leftJoinAndSelect("Jobs.applications","applications").where("Jobs.uid = :alumni_id", { alumni_id: alumni_id}).getMany()
    // var profile = await this.jobsRepository.createQueryBuilder("Jobs").leftJoinAndSelect("Jobs.applications","applications").leftJoinAndSelect("Applications.profile","profile").where("Jobs.uid = :alumni_id and applications.student_id = Profile.profile_id", { alumni_id: alumni_id}).getMany()
    // var profile = await this.jobsRepository.createQueryBuilder("Jobs").leftJoinAndSelect("Jobs.applications","applications").addSelect("applications.student_id").leftJoinAndSelect("profile.applications", "profile").where("Jobs.uid = :alumni_id and applications.student_id = profile.profile_id",{alumni_id}).getMany()
    var profile = await this.jobsRepository.createQueryBuilder("Jobs").leftJoinAndSelect("Jobs.applications","applications").leftJoin("applications.profile", "profile").addSelect("profile.fullname").addSelect("profile.profile_id").where("Jobs.uid = :alumni_id",{alumni_id}).getMany()
    return profile
  }

  async ChangeStatus(id: any,data:any): Promise<any> {
    try {
      this.applicationsRepository.createQueryBuilder().update(Applications).set(data).where("application_id = :application_id",{application_id:id}).execute();
          return {
          success: true,
          message: 'Status Changed',
        };
  

    } catch (err) {
      console.log('err', err);
      return {
        success: false,
        message: 'Status not changed',
      };
    }
  }

  async insertapplication(data: any,filename:string,job_id:string): Promise<any> {


    try {
      var job = await this.jobsRepository.findOne(job_id);
      console.log(data)
      var profile = await this.profileRepository.findOne({where:{profile_id:data.student_id}});
      const entityManager = getManager();
      var sample=[data.student_id,job_id]
      const application =await entityManager.query(`
      SELECT 
        count(*)
      FROM "Applications"  where "Applications"."profileProfileId" = $1 and "Applications"."jobsJobId" = $2;
      `,sample);
console.log(application)
      if(parseInt(application[0].count)){throw "Cannot Insert"}
console.log(filename)
      data.application_id = uuidv4();
      data.resume=filename
      data.jobs=job

      var applicationadd=new Applications()
      applicationadd=data;
      applicationadd.profile=profile
      await this.applicationsRepository.save(applicationadd);
      console.log(profile)

      return {
        success: true,
        message: 'Successfully inserted application',

      };
      // }

    } catch (err) {
      console.log('err', err);
      return {
        success: false,
        message: 'application not inserted',
      };
    }
  }

  async addremarks(data: any,id:any): Promise<any> {
    try {
      console.log(data)
      this.applicationsRepository.createQueryBuilder().update(Applications).set(data).where("application_id = :application_id",{application_id:id}).execute();
          return {
          success: true,
          message: 'Remarks Updated',
        };
  //

    } catch (err) {
      // console.log('err', err);
      return {
        success: false,
        message: 'Remarks not updated',
      };
    }
  }

  async selectresume(application_id: string): Promise<any> {
    const resume = await this.applicationsRepository.find({ where: application_id });
    return resume;
  }
///////////////////////////////////////////////////////////////////////////////////////////////////

  async deleteapplication(application_id: string): Promise<any> {
    try {

      var applicationdata = await this.applicationsRepository.findOne(application_id);
      console.log(applicationdata)
      console.log(applicationdata.resume)
      try{
        fs.unlinkSync(`./uploads/resume/${applicationdata.resume}`)
      }
      catch (err) {
        console.error(err)
      }
     
      
       await this.applicationsRepository.delete(application_id );
     
      return {
        success: true,
        message: 'Successfully deleted Application and Resume image',
      };

    } catch (err) {
      console.log('err', err);
      return {
        success: false,
        message: 'not deleted application and resume',
      };
    }
  }

  async deleteresume(application_id: string): Promise<any> {
    try {
      console.log("hi")
      console.log(application_id)
      var applicationdata = await this.applicationsRepository.findOne(application_id);
      console.log(applicationdata.resume)
      try{
        fs.unlinkSync(`./uploads/resume/${applicationdata.resume}`)
      }
      catch (err) {
        console.error(err)
      }
      applicationdata.resume=null
      this.applicationsRepository.save(applicationdata);
      // await this.applicationsRepository.delete(application_id)
      return {
        success: true,
        message: 'Successfully deleted resume',

      };

    } catch (err) {
      console.log('err', err);
      return {
        success: false,
        message: 'not deleted resume',
      };
    }
  }

  async updatejob(id: any,data:any): Promise<any> {
    try {
      console.log(data)
      this.applicationsRepository.createQueryBuilder().update(Jobs).set(data).where("job_id = :job_id",{job_id:id}).execute();
          return {
          success: true,
          message: 'job updated',
        };
  

    } catch (err) {
      console.log('err', err);
      return {
        success: false,
        message: 'Job not changed',
      };
    }
  }
}

