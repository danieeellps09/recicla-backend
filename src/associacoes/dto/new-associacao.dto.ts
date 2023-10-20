import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";
import { IsCnpjValid } from "src/decorators/cnpj.decorator";

export class NewAssociacao{

    @ApiProperty({
        example: 1,
        description: 'O identificador do usuário',
    })

    @IsNumber()
    userId?:number;

    @ApiProperty({
        example: '12.345.678/0001-90',
        description: 'O CJPJ da associação',
    })

    @IsString()
    @IsCnpjValid({message: "CNPJ inválido."})
    cnpj?:string;

    @ApiProperty({
        example: 'Rua x, Nº 111, bairro z',
        description: 'O endereco do usuário',
    })

    @IsString()
    endereco?: string;
}