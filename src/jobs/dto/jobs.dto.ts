import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';


export class JobsDto{
        @ApiProperty({ 
            description:"unique job id",
            type:'string'})
        @IsString()
        readonly job_id: string;
        @ApiProperty({
          description: 'Users id',
          type: 'string',
        
        })
        @IsString()
        readonly uid: string;
        @ApiProperty({
          description: 'Job name',
          type: 'string',
         example: 'Job name like full stack developer',
        })
        @IsString()
        readonly job_name: string;
        @ApiProperty({
            description: 'Job Type',
            type: 'string',
           example: 'full time, 1-2 year experience',
          })
          @IsString()
          readonly job_type: string;
          @ApiProperty({
            description: 'Job Details',
            type: 'string',
            example: 'Like full time empoloyment or 1 year',
          })
          @IsString()
          readonly job_details: string;
        
          @ApiProperty({
            description: 'Company name',
            type: 'string',
            example: 'Apple facebook',
          })
          @IsString()
          readonly company_name: string;

          @ApiProperty({
            description: 'skills',
            type: 'list',
            example: 'C python',
          })
          @IsString()
          readonly skills: string;

          @ApiProperty({
            description: 'Address of company',
            type: 'string',
            example: 'Sanfransisco, California',
          })
          @IsString()
          readonly address: string;
          
}