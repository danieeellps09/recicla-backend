import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class NewMaterial{

    @ApiProperty({
        example: 'Garrafa Pet',
        description: 'O tipo de material',
    })

    @IsString()
    nome?:string;
}