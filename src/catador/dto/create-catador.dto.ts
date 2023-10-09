import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateCatadorDto {


    @IsOptional()
    @IsNumber()
    id: number;


    @IsOptional()
    @IsNumber()
    userId: number;

    @ApiProperty({
        example: 'ecoponto da bezerra',
        description: 'associacao do catador',
      })
          
    @IsString()
    associacao?: string;

 
}