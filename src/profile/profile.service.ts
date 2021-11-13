import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import Profile from './entities/profile.entity';
import { v4 as uuidv4 } from 'uuid';
import Connections from './entities/connections.entity';
import Skills from './entities/skills.entity';
import Experience from './entities/experience.entity';

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
    private readonly experienceRepository: Repository<Experience>
  ) { }
  async getProfileDetails(): Promise<any> {
    const profile = await this.profileRepository.find();
    return profile;
  }
  async getProfileDetailsbyKey(key:string): Promise<any> {
    // const entitymanager=getManager
    var profile;
    return profile;
  }
  async getOneprofileDetail(profile_id: string): Promise<any> {
    var profile = await this.profileRepository.createQueryBuilder("profile").leftJoin("profile.skills", "skills").addSelect("skills.skill").leftJoinAndSelect("profile.experience", "experience").where("profile.profile_id = :profile_id", { profile_id: profile_id }).getOne()
    return profile;
  }

  async insertprofile(data: any,profile_id:string): Promise<any> {
    try {
      var skills = data["skills"]
      data.utype = "student"
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
      data.utype = "student"
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
      await this.profileRepository.delete(profile_id)
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


  async uploadprofileimage(profile_id: string, url: string): Promise<any> {

    try {
      var user = {
        profile_id: profile_id,
        profile_image_url: url
      }
      await this.profileRepository.save(user)

      return {
        success: true,
        message: 'profile picture is  uploaded'
      }


    } catch (err) {
      console.log('err', err);
      return {
        success: false,
        message: 'profile picture not uploaded',
      };
    }
  }

  async uploadcoverimage(profile_id: string, url: string): Promise<any> {

    try {
      var user = {
        profile_id: profile_id,
        cover_url: url
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
  async updateprofileimage(profile_id: string, filenameget: string): Promise<any> {

    try {
      var profiledata = await this.profileRepository.findOne({where:{profile_id:profile_id}});
      console.log(profiledata);
      var profile_image_url = profiledata.profile_image_url
      var url_split = profile_image_url.split("/")
      var filename = url_split[url_split.length - 1]
      //  console.log(`.../uploads/profile/${filename}`)
      try {
        fs.unlinkSync(`./uploads/profile/${filename}`)
        //file removed
      } catch (err) {
        console.error(err)
      }
      var user = {
        profile_id: profile_id,
        profile_image_url: filenameget
      }
      var pro= await this.profileRepository.save(user)

      return {
        success: true,
        message: 'profile image is updated'
      }


    } catch (err) {
      console.log('err', err);
      return {
        success: false,
        message: 'profile not inserted',
      };
    }
  }
  // async updateprofileimage(profile_id: string, url: string): Promise<any> {

  //   try {
  //     var profiledata = await this.profileRepository.findOne({where:{profile_id:profile_id}});
  //     console.log("profiledata");
  //     // console.log(profiledata);
  //     // var profile_image_url = profiledata.profile_image_url
  //     // var url_split = profile_image_url.split("/")
  //     var profile_image_url = profiledata.cover_url
  //     var url_split = profile_image_url.split("/")
  //     var filename = url_split[url_split.length - 1]
  //     //  console.log(`.../uploads/profile/${filename}`)
  //     try {
  //       fs.unlinkSync(`./uploads/profile/${filename}`)
  //       //file removed
  //     } catch (err) {
  //       console.error(err)
  //     }
  //     var user = {
  //       profile_id: profile_id,
  //       profile_image_url: url
  //     }
  //     await this.profileRepository.createQueryBuilder().update(Profile).set({ profile_image_url: url }).where("profile_id = :profile_id", { profile_id: profile_id }).execute()
  //     console.log(user)

  //     return {
  //       success: true,
  //       message: 'profile cover is updated'
  //     }


  //   } catch (err) {
  //     console.log('err', err);
  //     return {
  //       success: false,
  //       message: 'cover not inserted',
  //     };
  //   }
  // }
  async updatecoverimage(profile_id: any, filenameget: string): Promise<any> {

    try {
      var profiledata = await this.profileRepository.findOne({where:{profile_id:profile_id}});

      console.log(profiledata);
      var cover_url = profiledata.cover_url
      var url_split = cover_url.split("/")
      var filename = url_split[url_split.length - 1]
      //  console.log(`.../uploads/profile/${filename}`)
      try {
        fs.unlinkSync(`./uploads/cover/${filename}`)

      } catch (err) {
        console.error(err)
      }
      var user = {
        profile_id: profile_id,
        cover_url: filenameget
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
      console.log(profiledata);
      var profile_image_url = profiledata.profile_image_url
      var url_split = profile_image_url.split("/")
      var filename = url_split[url_split.length - 1]
      //  console.log(`.../uploads/profile/${filename}`)
      try {
        fs.unlinkSync(`./uploads/profile/${filename}`)
        //file removed
      } catch (err) {
        console.error(err)
      }
      var profiledatas = await this.profileRepository.createQueryBuilder().update(Profile).set({ profile_image_url: null }).where("profile_id = :profile_id", { profile_id: profile.profile_id }).execute()

      return {
        success: true,
        message: 'Successfully deleted profile image',
      };
    } catch (err) {
      console.log('err', err);
      return {
        success: false,
        message: 'profile picture not delete',
      };
    }
  }
  async deletecoverimage(profile: any): Promise<any> {

    try {
      var profiledata = await this.profileRepository.findOne(profile);
      console.log(profiledata);
      var cover_url = profiledata.cover_url
      var url_split = cover_url.split("/")
      var filename = url_split[url_split.length - 1]
      //  console.log(`.../uploads/profile/${filename}`)
      try {
        fs.unlinkSync(`./uploads/cover/${filename}`)
        //file removed
      } catch (err) {
        console.error(err)
      }
      await this.profileRepository.createQueryBuilder().update(Profile).set({ cover_url: null }).where("profile_id = :id", { id: profile.profile_id }).execute()

      return {
        success: true,
        message: 'Successfully delete profile cover',
      };
    } catch (err) {
      console.log('err', err);
      return {
        success: false,
        message: 'cover not deleted',
      };
    }
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
        await this.connectionRepository.createQueryBuilder().delete().where({ connected_profile: user_details, profile: current_User_details, status: "invite" }).execute()
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

