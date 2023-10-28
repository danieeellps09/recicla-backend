import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsNumber, IsOptional, IsString } from 'class-validator';
import { RegisterVendaDto } from './register-venda-dto';


export class UpdateVendaDto extends PartialType(RegisterVendaDto) {

    @ApiProperty({
        example: '1',
        description: 'Id da associacao',
    })
    @IsNumber()
    idAssociacao: number;


    @ApiProperty({
        example: 'Coca-cola',
        description: 'empresa que comprou',
    })
    @IsNumber()
    empresaCompradora: string;

    @ApiProperty({
        example: 1202,
        description: 'Quantidade coletada',
    })

    @IsNumber()
    qtdVendida: number;

    @ApiProperty({
        example: 'NF123456789"',
        description: 'Nota fiscal',
    })

    @IsString()
    notaFiscal: string;

    @ApiProperty({
        example: '22/10/2023',
        description: 'data do preenchimento do formulario de quando ele faz a coleta',
        required: false,
    })

    @IsOptional()
    @IsString()
    dataVenda: string;
}

