import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsString } from "class-validator";
import { Associacao } from "src/associacoes/entities/associacao.entity";
import { ReturnUserDto } from "src/user/dto/return-user.dto";

export class ReturnCatadorDto {

    @ApiProperty({
        example: 1,
        description: 'O identificador do catador',
    })
    id: number;

    @ApiProperty({
        example: '000.000.000-00',
        description: 'O CPF do catador',
    })
    cpf: string;

    @ApiProperty({
        example: 'Mucuripe',
        description: 'O nome do bairro',
    })
    bairro: string;

    @ApiProperty({
        example: 'Rua 305, Conjunto São Cristóvão',
        description: 'O endereco ',
    })
    endereco: string;

    @ApiProperty({ type: ReturnUserDto })
    @Type(() => ReturnUserDto)
    user: ReturnUserDto;

    @ApiProperty({ type: Associacao })
    @Type(() => Associacao)
    associacao: Associacao;
}