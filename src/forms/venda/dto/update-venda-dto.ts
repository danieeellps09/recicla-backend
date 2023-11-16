import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsDate, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { RegisterVendaDto } from './register-venda-dto';
import { Type } from 'class-transformer';
import { VendaMaterialDto } from './venda-produto.dto';


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
        example: 'NF123456789"',
        description: 'Nota fiscal',
    })

    @IsString()
    notaFiscal: string;

}

