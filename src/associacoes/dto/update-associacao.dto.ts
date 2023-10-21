import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";
import { IsCnpjValid } from "src/associacoes/decorators/cnpj.decorator";

export class UpdateAssociacaoDto{

    @ApiProperty({
        example: 1,
        description: 'O id de usuário',
    })
    @IsNumber()
    userId?: number;

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