import { ApiProperty } from "@nestjs/swagger";

export class ConnectionDto{
  @ApiProperty({
    description: 'profile_id',
    type: 'string',
  })
  readonly profile_id:string
}