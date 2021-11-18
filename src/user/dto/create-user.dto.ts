import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  MaxLength,
  MinLength,
  Matches,
  IsEmail,
  IsEnum,
  IsOptional,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'TnP MACE' })
  username: string;

  @ApiProperty({
    description: 'Email address',
    type: 'string',
    example: 'b19ec058@mace.ac.in',
  })
  @IsEmail()
  email: string;

  @ApiProperty({ enum: ['student', 'alumnus']})
  type: string;
  
  // @ApiProperty()
  // @IsOptional()
  // status : string;

  // @ApiProperty()
  // @IsOptional()
  // uid : string;

  @ApiProperty({
    description:
      ' Password with Minimum 1 symbol , Uppercase and Lowecase Characters,' +
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
  password: string;
  
  status: string;
  uid: string;

  // @ApiProperty({
  //   required: false,
  //   example: '38418417249124gj1h2f48172t412841g2478',
  //   description: 'Token for password reset',
  // })
  // @IsOptional()
  // @IsString()
  // readonly token: string;
}
