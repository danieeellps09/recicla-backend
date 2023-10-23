import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { CreateUserDto } from "src/user/dto/create-user.dto";

export class CreateCatadorDto {

  @IsOptional()
  @IsNumber()
  id: number;


  @IsOptional()
  @IsNumber()
  userId: number;

  @ApiProperty({
    example: '000.000.000-00',
    description: 'O CPF do catador',
  })

  @IsOptional()
  //Depois criar um decorator de cpf
  @IsString()
  cpf: string;

  @ApiProperty({ type: CreateUserDto })
  @ValidateNested()
  @Type(() => CreateUserDto)
  user: CreateUserDto;

  @ApiProperty({
    example: 'Mucuripe',
    description: 'O nome do bairro',
  })

  @IsString()
  bairro: string;

  @ApiProperty({
    example: 'Rua 305, Conjunto São Cristóvão',
    description: 'O endereco ',
  })

  @IsString()
  endereco: string;

  @ApiProperty({
    example: 1,
    description: 'O identificador da associação',
  })

  @IsNumber()
  idAssociacao: number;
}