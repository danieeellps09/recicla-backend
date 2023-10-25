import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { IsCnpjValid } from "src/associacoes/decorators/cnpj.decorator";
import { UpdateUserDto } from "src/user/dto/update-user.dto";

export class UpdateAssociacaoDto{

    @ApiProperty({
        example: '12.345.678/0001-90',
        description: 'O CJPJ da associação',
    })

    @IsString()
    @IsCnpjValid({message: "CNPJ inválido."})
    cnpj?:string;

    @ApiProperty({
        example: 'Mucuripe',
        description: 'O nome do bairro',
    })

    @IsString()
    bairro: string;

    @ApiProperty({
        example: 'Rua x, Nº 111, bairro z',
        description: 'O endereco do usuário',
    })

    @IsString()
    endereco?: string;

    @ApiProperty({ type: UpdateUserDto })
    @ValidateNested()
    @Type(() => UpdateUserDto)
    user: UpdateUserDto;
}