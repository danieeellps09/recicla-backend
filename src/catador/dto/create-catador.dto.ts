import { IsNumber, IsOptional, IsString } from "class-validator";

export class CatadorDto {


    @IsOptional()
    @IsNumber()
    id: number;


    @IsOptional()
    @IsNumber()
    userId: number;

    @IsString()
    associacao?: string;

    
    @IsString()
    veiculo?: string;
}