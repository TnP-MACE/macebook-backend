import { ApiProperty } from '@nestjs/swagger';
import { IsString,MaxLength } from 'class-validator';

export class PostsDto{
   
    
   

    @ApiProperty({
        description:"add your post",
        type:"string"
    })
    @IsString()
    readonly text:string;
    
        
        
    
}