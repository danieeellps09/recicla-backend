import { ApiProperty } from '@nestjs/swagger';

import { IsArray, IsBoolean, IsDate, IsEmail, IsNumber, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {

  @IsOptional()
  @IsNumber()
  id: number;

  @ApiProperty({
    example: 'Gian Felipe',
    description: 'O nome do usuário',
  })
  
  @IsString()
  name: string;
  

  @ApiProperty({
    example: 'Mucuripe',
    description: 'O nome do bairro' ,
  })

  @IsString()
  bairro: string;

  @ApiProperty({
    example: 'Rua 305, Conjunto São Cristóvão',
    description: 'O endereco ' ,
  })

  @IsString()
  endereco: string;

  @ApiProperty({
    example: 'gianfelipe@example.com',
    description: 'O email do usuário',
  })

  @IsEmail()
  email: string;
  
  @ApiProperty({
    example: 'gian.silva',
    description: 'O login do usuário',
  })

  @IsString()
  login: string;

  @ApiProperty({
    example: 'suasenha',
    description: 'A senha do usuário',
  })
  @IsOptional()
  @IsString()
  password: string;

  @ApiProperty({
    example: '(11) 99999-9999',
    description: 'O número de telefone do usuário',
  })

  @IsString()
  phone: string;
  
  @ApiProperty({
    example: 'true',
    description: 'O status do usuário',
  })

  @IsBoolean()
  status: boolean;
  
  @ApiProperty({
    example: ['admin', 'user', 'catador'],
    description: 'As roles do usuário',
  })
  @IsArray()
  roleNames: string[]; 


}
