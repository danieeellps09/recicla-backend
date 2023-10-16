import { ApiProperty } from "@nestjs/swagger";
import { NewMaterial } from "./new-material.dto";
import { IsNumber } from "class-validator";

export class UpdateMaterial extends NewMaterial{

    @ApiProperty({
        example: 1,
        description: 'Identificador do material',
    })

    @IsNumber()
    id?:number;
}