import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class EtniaDto {
    @ApiProperty({
        example: 'Indígena',
        description: 'A nomenclatura da etnia',
    })
    @IsString()
    nomenclatura: string;
}