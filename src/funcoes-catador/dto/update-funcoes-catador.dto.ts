// src/funcoesCatador/dto/update-funcoes-catador.dto.ts

import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsOptional } from "class-validator";

export class UpdateFuncoesCatadorDto {
  @ApiProperty({
    example: 'Coleta - Triciclo',
    description: 'A função do catador',
    required: false,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  funcao?: string;
}
