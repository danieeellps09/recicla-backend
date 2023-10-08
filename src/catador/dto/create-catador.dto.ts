import { IsOptional, IsString } from "class-validator";

export class CatadorDto {
    @IsOptional()
    @IsString()
    associacaoPertencente?: string;
  
    @IsOptional()
    @IsString()
    veiculo?: string;
  }