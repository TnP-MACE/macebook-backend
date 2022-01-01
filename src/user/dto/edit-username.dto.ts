import { ApiProperty } from '@nestjs/swagger';

export class EditUsernameDto{
    @ApiProperty({
        description: 'update username',
        type: 'string',
        example: 'sruwuthy',
      })
      username: string;        
}