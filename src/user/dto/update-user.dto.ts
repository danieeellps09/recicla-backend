import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsString } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {

  @ApiProperty({ example: 'gian.silva', description: 'O login do usuário',})

  @IsString()
  login: string;

  @ApiProperty({ example: 'suasenha', description: 'A senha do usuário', })

  @IsString()
  password: string;

  @ApiProperty({ example: 'Gian Silva', description: 'Nome do usuário' })
  @IsString()
  name?: string;

  @ApiProperty({ example: 'gianfelipe@example.com', description: 'E-mail do usuário' })
  @IsString()
  email?: string;

  @ApiProperty({ example: '(11) 99999-9999', description: 'Telefone do usuário' })
  @IsString()
  phone?: string;

  @ApiProperty({
    example: 'true',
    description: 'O status do usuário',
  })

  @IsBoolean()
  status: boolean;
}