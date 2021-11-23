import { IsEmail,IsNotEmpty,IsOptional,IsString,MaxLength,MinLength,Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({
    description: 'Email address',
    type: 'string',
    example: 'b19ec058@mace.ac.in',
  })
  @IsEmail()
  email: string;
  
  @ApiProperty()
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  @IsNotEmpty()
  password: string;
}