import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { getManager, Repository } from "typeorm";
import Profile from './entities/profile.entity';
import { v4 as uuidv4 } from 'uuid';
import Connections from './entities/connections.entity';
import Skills from './entities/skills.entity';
import Experience from './entities/experience.entity';
import { S3 } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';

const fs = require('fs')
@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    @InjectRepository(Connections)
    private readonly connectionRepository: Repository<Connections>,
    @InjectRepository(Skills)
    private readonly skillsRepository: Repository<Skills>,
    @InjectRepository(Experience)
    private readonly experienceRepository: Repository<Experience>,
    private readonly configService: ConfigService
  ) { }
  async getProfileDetails(key:string): Promise<any> {
    var sample="";
    const myArray=key.toLowerCase().split(" ");
      for(var i=0;i<myArray.length;i++){
        if(i==myArray.length-1){
          sample+=`LOWER(fullname) like '%`+myArray[i]+`%' `; 
        }else{
          sample+=`LOWER(fullname) like '%`+myArray[i]+`%' or `;
        }}
        console.log(sample)
      const entityManager = getManager();
      const profile =  await entityManager.query(`
      SELECT 
        profile_id, fullname
      FROM "Profile" where ${sample};
      `);
    return profile;
  }
  async getProfileDetailsbyKey(key:string): Promise<any> {
    // const entitymanager=getManager
    var profile;
    return profile;
  }
  async returnStatus(profile_id:string): Promise<any> {
    
      try {
        const entityManager = getManager();
      const profile =  await entityManager.query(`
      SELECT 
        profile_id, status, fullname
      FROM "Profile" where "profile_id" = '${profile_id}';
      `);
    return profile;
      } catch (error) {
        return{
          status:"incomplete"

        }
      }
  }
  async getOneprofileDetail(profile_id: string,my_id:string): Promise<any> {
    var profile = await this.profileRepository.createQueryBuilder("profile").leftJoin("profile.skills", "skills").addSelect("skills.skill").leftJoinAndSelect("profile.experience", "experience").where("profile.profile_id = :profile_id", { profile_id: profile_id }).getOne()

      if(my_id===profile_id)
      var connection_status="me";
      else{
        var conn = await this.connectionRepository.createQueryBuilder("connection").leftJoin("connection.connection_memberid","cmember_id").addSelect("cmember_id.profile_id").where("connection.connection_memberid=:my_id and connection.member_id=:profile_id  or connection.connection_memberid=:profile_id and connection.member_id=:my_id  ",{ my_id:my_id,profile_id: profile_id}).getOne()
        if(conn!=null){
          if(conn.status=== 'connect'){
            var connection_status="connected";
          }
          else{
            if(conn.connection_memberid.profile_id===my_id)
              var connection_status="Invited";
            else
              var connection_status="Accept";
          }
        }
        else
          var connection_status="connect";
      }
    return {profile:profile,
    
    connection_status:connection_status};
  }

  async insertprofile(data: any,profile_id:string): Promise<any> {
    try {
      var skills = data["skills"]
      // data.utype = data.utype
      data.profile_id=profile_id
      delete data.skills
      data.status="complete"
      var profile = await this.profileRepository.save(data);
      var skillarray = []
      if(skills){
        skills.forEach(element => {
          const skill = new Skills()
          skill.profile = profile.profile_id
          skill.skill = element
          skillarray.push(skill)
        });
      }
      await this.skillsRepository.delete({ profile: profile.profile_id })
      await this.skillsRepository.save(skillarray)
      return {
        success: true,
        message: 'Skills and post added'
      };


    } catch (err) {
      console.log('err', err);
      return {
        success: false,
        message: 'profile not completed',
      };
    }
  }

  async updateprofile(data: any,profile_id:string): Promise<any> {
    try {
      var skills = data["skills"]
      // data.utype = data.utype
      data.profile_id=profile_id
      delete data.skills
      var profile = await this.profileRepository.save(data);
      var skillarray = []
      if(skills){
        skills.forEach(element => {
          const skill = new Skills()
          skill.profile = profile.profile_id
          skill.skill = element
          skillarray.push(skill)
        });
      }
      await this.skillsRepository.delete({ profile: profile.profile_id })
      await this.skillsRepository.save(skillarray)
      return {
        success: true,
        message: 'Skills and post updated'
      };


    } catch (err) {
      console.log('err', err);
      return {
        success: false,
        message: 'profile not updated',
      };
    }
  }
  async deleteprofile(profile_id: string): Promise<any> {
    try {
      console.log(profile_id);
      
      const profile=await this.profileRepository.find({profile_id:profile_id});
      
      if(profile[0].profile_image_url){
        try {
          fs.unlinkSync(`./uploads/profile/${profile[0].profile_image_url}`)
          //file removed
        } catch (err) {
          console.error(err)
        }
      }
      if(profile[0].cover_url){
        try{
          fs.unlinkSync(`./uploads/cover/${profile[0].cover_url}`)
          //file removed
        } catch (err) {
          console.error(err)
        }
      }
      await this.profileRepository.delete({profile_id:profile_id});

      console.log(profile);
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

  // COVER AND PROFILE IMAGE

  async uploadprofileimage(profile_id: string, imageBuffer: Buffer, url: string): Promise<any> {
    try {
      const s3 = new S3();
      const uploadResult = await s3.upload({
      Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
      Body: imageBuffer,
      Key: `${uuidv4()}-${url}`
    })
      .promise();

    var profile = await this.profileRepository.findOne({profile_id})
      if (profile){
        var user = {
          profile_id: profile_id,
          profile_image_url: uploadResult.Location,
          profile_image_key : uploadResult.Key
        }
      }

      await this.profileRepository.save(user)

      return {
        success: true,
        message: 'profile picture is  uploaded'
      }


    } catch (err) {
      return {
        success: false,
        message: 'profile picture not uploaded',
      };
    }
  }

  async uploadcoverimage(profile_id: string, imageBuffer: Buffer, url: string): Promise<any> {
    try {
      const s3 = new S3();
      const uploadResult = await s3.upload({
      Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
      Body: imageBuffer,
      Key: `${uuidv4()}-${url}`
      })
      .promise();
  
      var profile = await this.profileRepository.findOne({profile_id})
      
      if (profile){
      var user = {
        profile_id: profile_id,
        cover_url: uploadResult.Location,
        cover_key : uploadResult.Key
      }
      }
      
      await this.profileRepository.save(user)

      return {
      success: true,
      message: 'profile cover is uploaded'
      }

    } catch (err) {
      console.log('err', err);
      return {
        success: false,
        message: 'profile cover not uploaded',
      };
    }
  }

  async updateprofileimage(profile_id: string, imageBuffer: Buffer, url: string): Promise<any> {
      try {
        var profile = await this.profileRepository.findOne({profile_id})
        const s3 = new S3();
        await s3.deleteObject({
          Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
          Key: profile.profile_image_key,
        }).promise();
        const uploadResult = await s3.upload({
        Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
        Body: imageBuffer,
        Key: `${uuidv4()}-${url}`
        })
        .promise();

          var user = {
            profile_id: profile_id,
            profile_image_url: uploadResult.Location,
            profile_image_key : uploadResult.Key
          }
      
       await this.profileRepository.save(user)

      return {
        success: true,
        message: 'profile image is updated'
      }

    } catch (err) {
      return {
        success: false,
        message: 'profile not inserted',
      };
    }
  }

  async updatecoverimage(profile_id: any, imageBuffer: Buffer, url: string): Promise<any> {
    try {
      var profiledata = await this.profileRepository.findOne({profile_id})
      const s3 = new S3();
      await s3.deleteObject({
        Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
        Key: profiledata.cover_key,
      }).promise();
      const uploadResult = await s3.upload({
      Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
      Body: imageBuffer,
      Key: `${uuidv4()}-${url}`
      })
      .promise();
      var user = {
        profile_id: profile_id,
        cover_url: uploadResult.Location,
        cover_key : uploadResult.Key
      }
      await this.profileRepository.save(user)
      return {
        success: true,
        message: 'profile cover is updated'
      }
    } catch (err) {
      console.log('err', err);
      return {
        success: false,
        message: 'profile not inserted',
      };
    }
  }

  async deleteprofileimage(profile: any): Promise<any> {
    try {
      var profiledata = await this.profileRepository.findOne(profile);
      const s3 = new S3();
      await s3.deleteObject({
        Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
        Key: profiledata.profile_image_key,
      }).promise();
      await this.profileRepository.createQueryBuilder().update(Profile).set({ profile_image_url: null, profile_image_key:null }).where("profile_id = :profile_id", { profile_id: profiledata.profile_id }).execute()
      return {
        success: true,
        message: 'Successfully deleted profile image',
      };
    } catch (err) {
      return {
        success: false,
        message: 'profile picture not delete',
      };
    }
  }

  async deletecoverimage(profile: any): Promise<any> {
    try {
      var profiledata = await this.profileRepository.findOne(profile);
      const s3 = new S3();
      await s3.deleteObject({
        Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
        Key: profiledata.cover_key,
      }).promise();
      await this.profileRepository.createQueryBuilder().update(Profile).set({ cover_url: null, cover_key:null }).where("profile_id = :id", { id: profile.profile_id }).execute()
      return {
        success: true,
        message: 'Successfully delete profile cover',
      };
    } catch (err) {
      return {
        success: false,
        message: 'cover not deleted',
      };
    }
  }

  getImage(fileKey : string){
    const s3 = new S3();
    return s3.getObject({Key: fileKey, Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME') }).createReadStream()
  }


  // CONNECTIONS

  async connectioninvite(user_id: string, current_User: any): Promise<any> {

    if (user_id != current_User) {
      try {
        console.log(user_id)
        console.log(current_User)

        var user_details = await this.profileRepository.findOne(user_id)
        var current_User_details = await this.profileRepository.findOne(current_User)

        if (user_details && current_User_details) {
          var check = await this.connectionRepository.findOne({ member_id: user_details, connection_memberid: current_User_details })
          console.log(check)
          if (check == null) {
            var data = new Connections()
            data = {
              connection_id: uuidv4(),
              member_id: user_details,
              status: "invite",
              connection_memberid: current_User_details
            }
            await this.connectionRepository.save(data);
            return {
              success: true,
              message: 'Connection invitation send'
            }
          }
          else {
            return {
              success: true,
              message: 'Already invited'
            }
          }
        }
      } catch (err) {
        console.log('err', err);
        return {
          success: false,
          message: 'connection cannot be sent',
        };
      }
    }
    else {
      return {
        success: false,
        message: "Cannot connect same user"
      }
    }
  }

  async connectionaccept(user: any, current_User: any): Promise<any> {

    if (user.id != current_User) {
      try {
        console.log(user)
        // console.log(current_User)
        var user_details = await this.profileRepository.findOne(user.id)
        var current_User_details = await this.profileRepository.findOne(current_User)
        if (user_details && current_User_details) {
          var check = await this.connectionRepository.findOne({ member_id: current_User_details, connection_memberid: user_details, status: "invite" })
          console.log(check)
          if (check != null) {
            await this.connectionRepository.createQueryBuilder().update(Connections).set({ status: "connected" }).where("connection_id = :connection_id", { connection_id: check.connection_id }).execute()
            var data = new Connections()
            data = {
              connection_id: uuidv4(),
              member_id: user_details,
              status: "connected",
              connection_memberid: current_User_details
            }
            await this.connectionRepository.save(data);
            return {
              success: true,
              message: 'Connected'
            }
          }
          else {
            return {
              success: true,
              message: 'No invitation'
            }
          }
        }
      } catch (err) {
        console.log('err', err);
        return {
          success: false,
          message: 'No such users',
        };
      }
    }
    else {
      return {
        success: false,
        message: "Cannot connect same user"
      }
    }
  }


  async connectiondisconnect(user: any, current_User: any): Promise<any> {

    if (user.id != current_User) {

      try {
        var user_details = await this.profileRepository.findOne(user.id)
        var current_User_details = await this.profileRepository.findOne(current_User)
        var stu1=await this.connectionRepository.createQueryBuilder().delete().where({ member_id: current_User_details, connection_memberid: user_details, status: "connected" }).execute()
        var stu2=await this.connectionRepository.createQueryBuilder().delete().where({ member_id: user_details, connection_memberid: current_User_details, status: "connected" }).execute()
        return {
          success: true,
          message: 'Disconnected',
        };
      } catch (err) {
        return {
          success: false,
          message: 'Cannot disconnect/or nothing to disconnect',
        };
      }
    }
    else {
      return {
        success: false,
        message: "Cannot disconnect same user"
      }
    }
  }
  async connectioncancel(user: any, current_User: any): Promise<any> {

    if (user.id != current_User) {
      try {
        var user_details = await this.profileRepository.findOne(user.id)
        var current_User_details = await this.profileRepository.findOne(current_User)
        await this.connectionRepository.createQueryBuilder().delete().where({ member_id: user_details, connection_memberid: current_User_details, status: "invite" }).execute()
        return {
          success: true,
          message: 'Cancelled',
        };
      } catch (err) {
        console.log('err', err);
        return {
          success: false,
          message: 'Cannot Cancel',
        };
      }
    }
    else {
      return {
        success: false,
        message: "Cannot Cancel invitations of same user"
      }
    }
  }



  // EXPERIENCE

  async addExperience(profile_id: any, data: any): Promise<any> {
    console.log(profile_id)
console.log("data");
    try {
      try {
        var profile = await this.profileRepository.findOne(profile_id);
      } catch (error) {
        console.log(error)
      }
console.log(profile)
      data.profile = profile.profile_id
      console.log(data);

      var exp= await this.experienceRepository.save(data);

      console.log(exp);
      return {
        experience:exp,
        success: true,
        message: 'Experience Added',
      };
    } catch (err) {
      return {
        success: false,
        message: 'Cannot Add Experience',
      };
    }
  }
  async updateExperience( experience_id: string, data: any): Promise<any> {

    try {
      console.log(experience_id);
      delete (data.company_id)
      this.experienceRepository.createQueryBuilder().update(Experience).set(data).where("experience_id = :experience_id", { experience_id: experience_id }).execute();
      return {
        success: true,
        message: 'Experience Updated',
      };
    } catch (err) {
      return {
        success: false,
        message: 'Cannot Update Experience',
      };
    }
  }
  async deleteExperience(experience_id: string): Promise<any> {

    try {
      await this.experienceRepository.createQueryBuilder().delete().where({ experience_id: experience_id }).execute()
      return {
        success: true,
        message: 'Deleted',
      };
    } catch (err) {
      return {
        success: false,
        message: 'Cannot Delete',
      };
    }
  }

}

