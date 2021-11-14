import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, ValidateNested } from 'class-validator';
import Skills from '../entities/skills.entity';

export class ExperienceDto {
  @ApiProperty({
    description: 'Company Name',
    type: 'string',
    example:'Apple'
  })
  @IsString()
  @MaxLength(128)
  readonly company_name: string;

  @ApiProperty({
    description: 'Logo',
    type: 'string',
    example:'keyvalue.systems'
  })
  @IsString()
  @MaxLength(50)
  readonly company_logo: string;

  @ApiProperty({
    description: 'Position',
    type: 'string',
    example:'Developer'
  })
  @IsString()
  @MaxLength(50)
  readonly position: string;

  @ApiProperty({
    description: 'About',
    type: 'string',
    example:'This is a sample bio'
  })
  @IsString()
  @MaxLength(1024)
  readonly about: string;

  @ApiProperty({
    description: 'Certificate_url',
    type: 'string',
    example:'https/sdfs/dsf'
  })
  @IsString()
  readonly certificate_url: string;
  
  @ApiProperty({
    description: 'Start Time',
    type: 'string',
    example:{month:'April',year:2000}
  })
  @ValidateNested({each:true})
  readonly start_time:{month:string,year:number};

  @ApiProperty({
    description: 'End Time',
    type: 'simple-json',
    example:{month:'April',year:2000}
  })
  @ValidateNested({each:true})
  readonly end_time:{month:string,year:number};
}