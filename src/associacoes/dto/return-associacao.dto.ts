import { ApiProperty } from "@nestjs/swagger";
import { ReturnUserDto } from "src/user/dto/return-user.dto";
import { Type } from "class-transformer";
import { IsString } from "class-validator";

export class ReturnAssociacaoDto{
    @ApiProperty({
        example: 1,
        description: 'O identificador da associação',
    })
    id: number;

    @ApiProperty({ type: ReturnUserDto })
    @Type(() => ReturnUserDto)
    user: ReturnUserDto;

    @ApiProperty({
        example: '12.345.678/0001-90',
        description: 'O CJPJ da associação',
    })

    @IsString()
    cnpj?: string;

    @ApiProperty({
        example: 'Barra do Ceará',
        description: 'O bairro da associação',
    })
    bairro?: string;

    @ApiProperty({
        example: 'Rua x, Nº 111, bairro z',
        description: 'O endereco da associação',
    })

    @IsString()
    endereco?: string;
}