import { ApiProperty } from '@nestjs/swagger';

import { IsArray, IsBoolean, IsDate, IsEmail, IsNumber, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class RegisterVendaDto {
  @IsOptional()
  @IsNumber()
  id: number;
  

  @IsOptional()
  @IsNumber()
  idAssociacao: number;


  @ApiProperty({
    example: 'Coca-cola',
    description: 'empresa que comprou',
  })
  @IsString()
  empresaCompradora: string;

  @ApiProperty({
    example: '32132',
    description: 'Quantidade coletada',
  })
  
  @IsNumber()
  qtdVendida: number;
  

 

  @ApiProperty({
    example: 'NF123456789"',
    description: 'Nota fiscal' ,
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
