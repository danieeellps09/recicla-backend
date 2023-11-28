// src/funcoesCatador/dto/create-funcoes-catador.dto.ts

import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

export class CreateFuncoesCatadorDto {
  @ApiProperty({
    example: 'Coleta - Triciclo',
    description: 'A função do catador',
  })
  @IsNotEmpty()
  @IsString()
  funcao: string;
}
