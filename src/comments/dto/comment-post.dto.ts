import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';


export class CommentPostDto {

  @ApiProperty({
    description: 'post comment',
    type: 'string',
    example: 'Hello, this is a cool post. Hey congrats on your new job.',
  })
  @IsString()
  readonly body: string;
}