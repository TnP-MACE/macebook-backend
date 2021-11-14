import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, MaxLength, ValidateNested } from 'class-validator';
import Skills from '../entities/skills.entity';

export class ProfileParameter{
  profile_id:string
}

export class ProfileDto {
  @ApiProperty({
    description: 'Fullname',
    type: 'string',
    example:'Aneez Muhammed'
  })
  @IsString()
  @MaxLength(128)
  readonly fullname: string;

  @ApiProperty({
    description: 'Admission',
    type: 'list',
    example:{admission_no:'B18CS008',branch:'CSE',batch:'2019'}
  })
  @ValidateNested({ each: true })
  readonly admission: { admission_no: string,branch:string, batch: string };
  
  @ApiProperty({
    description: 'Phone No',
    type: 'string',
    example:'+919943435345'
  })
  @IsString()
  @MaxLength(15)
  readonly phoneno: string;

  @ApiProperty({
    description: 'Urs',
    type: '"simple-json"',
    example:{ personal_url:"www.sad.com", linkedin: "www.sad.com", facebook: "www.sad.com",github: "www.sad.com" }
  })
  @ValidateNested({ each: true })
  readonly urls: { personal_url:string, linkedin: string, facebook: string,github: string };

  @ApiProperty({
    description: 'About',
    type: 'string',
    example:'This is a sample bio'
  })
  @IsString()
  @MaxLength(1024)
  readonly about: string;

  @ApiProperty({
    description: 'Address',
    type: 'simple-json',
    example:{ place:"Hello", district: "KTM", state: "Kerala",country: "India" }
  })
  @ValidateNested({ each: true })
  readonly address: { place:string, district: string, state: string,country: string };

  @ApiProperty({
    description: 'Ref Name',
    type: 'string',
    example:'Kurian'
  })
  @IsString()
  readonly ref_fullname: string;
  
  @ApiProperty({
    description: 'Ref Email',
    type: 'string',
    example:'1@mail.com'
  })
  @IsString()
  readonly ref_email: string;

  @ApiProperty({
    description: 'Ref Phone',
    type: 'string',
    example:'+9144434343'
  })
  @IsString()
  readonly ref_phonenumber: string;

  @ApiProperty({
    description: 'Skills',
    type: 'simple-array',
    example:["CSS","HTML"]
  })
  @IsArray()
  readonly skills: Skills[];
  
  @ApiProperty({
    description: 'Type',
    type: 'string',
    example:"student"
  })
  @IsString()
  readonly utype: string;
  
  @ApiProperty({
    description: 'accomplishments',
    type: 'simple-array',
    example:["CSS","HTML"]
  })
  @IsArray()
  readonly accomplishments: string[];
}