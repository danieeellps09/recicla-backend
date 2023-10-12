import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class UpdateVeiculo{
    
    @ApiProperty({
        example: 1,
        description: 'O identificador do veículo',
    })

    @IsNumber()
    id:number;

    @ApiProperty({
        example: 'Triciclo Elétrico',
        description: 'O tipo de veículo',
    })

    @IsString()
    nomeVeiculo:string;
}