import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, ValidateNested } from 'class-validator';


export class JobsDto{
        @ApiProperty({ 
            description:"unique job id",
            type:'string'})
        @IsString()
        readonly job_id: string;
        @ApiProperty({
          description: 'Users id',
          type: 'string',
          example:'vwsjjbjjxj'
        })
        @IsString()
        readonly uid: string;
        @ApiProperty({
          description: 'Job name',
          type: 'string',
         example: 'Software Devloper',
        })
        @IsString()
        readonly job_name: string;
        @ApiProperty({
            description: 'Job Type',
            type: 'string',
           example: ["Full Time","1 year Experience"],
          })
          @IsString()
          readonly job_type: string;
          @ApiProperty({
            description: 'Job Details',
            type: 'string',
            example: 'A good job with free food',
          })
          @IsString()
          readonly job_description: string;
        
          @ApiProperty({
            description: 'Company name',
            type: 'string',
            example: 'Apple',
          })
          @IsString()
          readonly company_name: string;

          @ApiProperty({
            description: 'Salary',
            type: 'string',
            example: '1000',
          })
          @IsString()
          readonly salary: string;

          @ApiProperty({
            description: 'skills',
            type: 'list',
            example: ["C++","java","python"],
          })
          @IsArray()
          readonly skills: string[];

          @ApiProperty({
            description: 'Address of company',
            type: 'string',
            example: {
              state:"California",
              city:"LA"
          },
          })
          @ValidateNested()
          readonly address: {state:string,city:string};
    
          @ApiProperty({
            description: 'Domain of company',
            type: 'string',
            example: 'apple.com',
          })
          @IsString()
          readonly domain: string;
}

export class SearchJobsDto{
  @ApiProperty({ 
      description:"search job",
      type:'string'})
  @IsString()
  readonly search: string;
 }

 