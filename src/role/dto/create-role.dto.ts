import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsEmail, IsNumber, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateRoleDto {

  @IsOptional()
  @IsNumber()
  id: number;

  @ApiProperty({
    example: 'Analista de Sistemas',
    description: 'O nome da Função',
  })

  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Profissional responsável por analisar e melhorar sistemas e processos',
    description: 'A descrição da função',
  })

  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty({
    example: 'true',
    description: 'O status do usuário',
  })

  @IsBoolean()
  status: boolean;

}
