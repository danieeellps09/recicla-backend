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
    example: 'gianfelipe@example.com',
    description: 'O email do usuário',
  })

  @IsEmail()
  email: string;
 
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
  
  @IsOptional()
  @IsArray()
  roleNames: string[]; 


}
