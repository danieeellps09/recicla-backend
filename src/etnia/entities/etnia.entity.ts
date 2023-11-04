import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class Etnia {

  @ApiProperty({
    example: 1,
    description: 'O identificador do gênero',
  })

  @IsNumber()
  id: number;

  @ApiProperty({
    example: 'Homem Cisgênero',
    description: 'A nomenclatura do gênero',
  })
  @IsString()
  nomenclatura: string;
}