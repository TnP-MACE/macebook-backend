import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, MaxLength, MinLength } from 'class-validator'

export class ChangePasswordDto {
 
  @ApiHideProperty()
  @ApiProperty({
    example: 'AZDq-49.orAZWN',
  })
  @IsString()
  readonly currentPassword: string;

  @ApiProperty({
    description:
      ' Password with Minimum 1 symbol , Uppercase and Lowercase Characters,' +
      ' number with minimum length of 8 characters',
    type: 'string',
    example: 'AZDq-49.orAZWN',
  })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'too weak password',
  })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  readonly password: string;

}