import { ApiProperty } from '@nestjs/swagger';
import { isEmpty, IsOptional, IsString } from 'class-validator';
import { IsNull } from 'typeorm';


export class ApplicationsDto{
        
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
          // @IsDoc
          // readonly resume: File;

//           @ApiProperty({
//             description: 'remark can be added by alumni',
//             type: 'string',
//             example: 'potential candidate',
//           })
//           @IsString()
//           @IsOptional()
//           readonly remarks?: string;
}

export class RemarksDto{
        
  @ApiProperty({
    description: 'Remarks from alumni',
    type: 'string',
   example: 'potential candidate',
  })
  @IsString()
  @IsOptional()
  readonly remarks: string;
  
}

export class UpdateApplicationsDto{
        
  // @ApiProperty({
  //   description: 'student Id',
  //   type: 'string',
  //  example: '101',
  // })
  // @IsString()
  // readonly student_id: string;
  // @ApiProperty({
  //     description: 'To show new application',
  //     type: 'Boolean',
  //    example: 'True or False',
  //   })
  //   @IsString()
  //   readonly status: boolean;
  
  
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
    // @IsDoc
    // readonly resume: File;

//           @ApiProperty({
//             description: 'remark can be added by alumni',
//             type: 'string',
//             example: 'potential candidate',
//           })
//           @IsString()
//           @IsOptional()
//           readonly remarks?: string;
}