import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsString, ValidateNested } from "class-validator";
import { IsCnpjValid } from "src/associacoes/decorators/cnpj.decorator";
import { CreateUserDto } from "src/user/dto/create-user.dto";

export class NewAssociacao {

    @ApiProperty({ type: CreateUserDto })
    @ValidateNested()
    @Type(() => CreateUserDto)
    user: CreateUserDto;

    @ApiProperty({
        example: '12.345.678/0001-90',
        description: 'O CJPJ da associação',
    })

    @IsString()
    @IsCnpjValid({ message: "CNPJ inválido." })
    cnpj?: string;

    @ApiProperty({
        example: 'Barra do Ceará',
        description: 'O bairro da associação',
    })
    @IsString()
    bairro?: string;

    @ApiProperty({
        example: 'Rua x, Nº 111, bairro z',
        description: 'O endereco da associação',
    })

    @IsString()
    endereco?: string;
}