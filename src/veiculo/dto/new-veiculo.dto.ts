import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class NewVeiculo{
    
    @ApiProperty({
        example: 'Triciclo Elétrico',
        description: 'O tipo de veículo',
    })

    @IsString()
    nomeVeiculo:string;
}