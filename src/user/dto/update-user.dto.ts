import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsNumber, IsOptional, IsString } from 'class-validator';
import { IsTelefoneValid } from 'src/decorators/telefone.decorator';

export class UpdateUserDto extends PartialType(CreateUserDto) {

  @IsNumber()
  id: number;

  @ApiProperty({ example: 'suasenha', description: 'A senha do usuário', })
  @IsOptional()
  @IsString()
  password: string;

  @ApiProperty({ example: 'Gian Silva', description: 'Nome do usuário' })
  @IsString()
  name?: string;

  @ApiProperty({ example: 'gianfelipe@example.com', description: 'E-mail do usuário' })
  @IsString()
  email?: string;

  @ApiProperty({ example: '(11) 99999-9999', description: 'Telefone do usuário' })
  @IsTelefoneValid({message: "Telefone inválido!"})
  @IsString()
  phone?: string;

  @ApiProperty({
    example: 'true',
    description: 'O status do usuário',
  })

  @IsBoolean()
  status: boolean;
}