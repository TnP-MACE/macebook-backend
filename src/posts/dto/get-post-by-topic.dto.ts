import { IsOptional, IsString } from "class-validator";

export class GetPostByTopic{
    
    @IsOptional()
    @IsString()
    topic?:string

    @IsOptional()
    @IsString()
    search?:string
}

