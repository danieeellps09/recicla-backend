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
    @IsString()
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

  
}

