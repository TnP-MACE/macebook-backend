import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  Matches,
} from 'class-validator';

export enum UserType {
  STUDENT = "student",
  ALUMNUS = "alumnus",
  GHOST = "ghost"
}

export class CreateUserDto {
  @ApiProperty({ example: 'TnP MACE' })
  readonly username: string;

  @ApiProperty({
    description: 'Email address',
    type: 'string',
    example: 'b19ec058@mace.ac.in',
  })
  @IsString()
  readonly email: string;

  @ApiProperty({ enum: ['student', 'alumnus']})
  readonly type: string;

  @ApiProperty({
    description:
      ' Password with Minimum 1 symbol , Uppercase and Lowecase Characters,' +
      ' number with minimum length of 14 characters',
    type: 'string',
    example: 'AZDq-49.orAZWN',
  })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'too weak password',
  })
  @IsString()
  @MinLength(14)
  @MaxLength(128)
  readonly password: string;

  // @ApiProperty({
  //   required: false,
  //   example: '38418417249124gj1h2f48172t412841g2478',
  //   description: 'Token for password reset',
  // })
  // @IsOptional()
  // @IsString()
  // readonly token: string;
}
