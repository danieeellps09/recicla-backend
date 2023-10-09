import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNumber, IsOptional, IsString } from "class-validator";

export class CatadorDto {


    @IsOptional()
    @IsNumber()
    id: number;


    @IsOptional()
    @IsNumber()
    userId: number;

    @ApiProperty({
        example: 'ecoponto da bezerra',
        description: 'associacao do catador',
      })
          
    @IsString()
    associacao?: string;

    @ApiProperty({
      example: ['Bicicleta elétrica', 'Caminhão'],
      description: 'Veículos do catador',
    })
    @IsArray()
    @IsString({ each: true }) 
    veiculos: string[];
}