import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";
import { NewVeiculo } from "./new-veiculo.dto";

export class UpdateVeiculo extends  PartialType(NewVeiculo){
    
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