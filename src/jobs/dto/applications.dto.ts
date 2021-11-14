import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';


export class ApplicationsDto{
        @ApiProperty({ 
            description:"unique application id",
            type:'string'})
        @IsString()
        readonly application_id: string;
        // @ApiProperty({
        //   description: 'Job id',
        //   type: 'string',
        //   example:''
        // })
        // @IsString()
        // readonly job_id: string;
        @ApiProperty({
          description: 'student Id',
          type: 'string',
         example: '101',
        })
        @IsString()
        readonly student_id: string;
        // @ApiProperty({
        //     description: 'To show new application',
        //     type: 'Boolean',
        //    example: 'True or False',
        //   })
        //   @IsString()
        //   readonly status: boolean;
          @ApiProperty({
            description: 'Resume file link',
            type: 'string',
            example: 'Resume.pdf',
          })
          @IsString()
          readonly resume: string;
        
          @ApiProperty({
            description: 'The message sent from student while creating an application',
            type: 'string',
            example: 'Any important message',
          })
          @IsString()
          readonly message: string;

          // @ApiProperty({
          //   description: 'Alumni can star the application from a student',
          //   type: 'boolean',
          //   example: 'True or False',
          // })
          // @IsString()
          // readonly star: boolean;

          @ApiProperty({
            description: 'remark can be added by alumni',
            type: 'string',
            example: 'potential candidate',
          })
          @IsString()
          readonly remarks: string;
}