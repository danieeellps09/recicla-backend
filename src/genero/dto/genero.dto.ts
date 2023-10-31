import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class GeneroDto {
    @ApiProperty({
        example: 'Homem Cisgênero',
        description: 'A nomenclatura do gênero',
    })
    @IsString()
    nomenclatura: string;
}