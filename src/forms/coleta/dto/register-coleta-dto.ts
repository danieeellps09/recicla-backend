import { ApiProperty } from '@nestjs/swagger';

import { IsArray, IsBoolean, IsDate, IsEmail, IsNumber, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class RegisterColetaDto {
  @IsOptional()
  @IsNumber()
  id: number;

  @ApiProperty({
    example: '1',
    description: 'Id da associacao do catador',
  })
  @IsNumber()
  idAssociacao: number;


  @ApiProperty({
    example: '1',
    description: 'Id do veiculo que foi usado',
  })
  @IsNumber()
  idVeiculo: number;

  @ApiProperty({
    example: '32132',
    description: 'Quantidade coletada',
  })
  
  @IsNumber()
  quantidade: number;
  

  @ApiProperty({
    example: '',
    description: 'Todos os pontos foram visitados?' ,
  })

  @IsBoolean()
  pergunta: boolean;

  @ApiProperty({
    example: 'Não deu certo pois tive que terminar mais cedo',
    description: 'motivo se a pergunta for falsa' ,
  })

  @IsString()
  motivo: string;

}
