import { ApiProperty } from '@nestjs/swagger';

import { IsArray, IsBoolean, IsDate, IsEmail, IsNumber, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class RegisterColetaDto {

  @IsOptional()
  @IsNumber()
  id: number;

  @ApiProperty({
    example: '1',
    description: 'Id do catador que preenche formulario',
  })
  @IsNumber()
  idCatador: number;


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
    example: 'Todos os pontos foram visitados?',
    description: 'true=sim, false=não' ,
  })

  @IsBoolean()
  pergunta: boolean;

 

}
