import { IsNumber, IsOptional, IsString } from "class-validator";

export class CatadorDto {


    @IsOptional()
    @IsNumber()
    id: number;


    @IsOptional()
    @IsNumber()
    userId: number;

    @IsOptional()
    @IsString()
    associacao?: string;

    @IsOptional()
    @IsString()
    veiculo?: string;
}