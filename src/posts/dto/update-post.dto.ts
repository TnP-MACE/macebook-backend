import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdatePostDto{
    

    @ApiProperty({
        description:" text on your post",
        type:"string"
    })
    @IsString()
    text:string

}