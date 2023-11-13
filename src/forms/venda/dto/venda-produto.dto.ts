import { ApiProperty } from "@nestjs/swagger";
import { IsCurrency, IsNumber } from "class-validator";

export class VendaMaterialDto {

    @ApiProperty({
        example: 1,
        description: 'Identificador do produto',
    })
    @IsNumber()
    idMaterial: number;

    @ApiProperty({
        example: 13.25,
        description: 'Quantidade coletada',
    })
    @IsNumber()
    quantidade: number;
}