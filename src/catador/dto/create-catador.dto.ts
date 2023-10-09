import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";

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
        example: 'bike eletrica',
        description: 'Veículo do catador',
      })
    
    @IsString()
    veiculo?: string;
}