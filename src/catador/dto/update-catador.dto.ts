import { ApiProperty, PartialType } from "@nestjs/swagger";
import { CreateCatadorDto } from "./create-catador.dto";
import { IsNumber, IsOptional, IsString } from "class-validator";
export class UpdateCatadorDto extends PartialType(CreateCatadorDto) {


    @IsNumber()
    id: number;


    @IsNumber()
    userId: number;


    @ApiProperty({ example: 'Associacao', description: 'Associação do catador', })
    @IsString()
    associacao: string;



}