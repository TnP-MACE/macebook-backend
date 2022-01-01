import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class DeleteAccountDto{
    @ApiHideProperty()
    @ApiProperty({
      example: 'AZDq-49.orAZWN',
    })
    @IsString()
    readonly password: string;
}