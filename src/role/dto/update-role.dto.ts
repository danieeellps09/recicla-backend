import { PartialType, ApiProperty } from "@nestjs/swagger";
import { IsString, IsBoolean, IsOptional, IsNumber } from "class-validator";
import { CreateRoleDto } from "./create-role.dto";

export class UpdateRoleDto extends PartialType(CreateRoleDto) {

    @IsNumber()
    id: number;

    @ApiProperty({
        example: 'Analista de Sistemas',
        description: 'O nome da Função',
    })

    @IsOptional()
    @IsString()
    name: string;

    @ApiProperty({
        example: 'Profissional responsável por analisar e melhorar sistemas e processos',
        description: 'A descrição da função',
    })

    @IsOptional()
    @IsString()
    description: string;

    @ApiProperty({
        example: 'true',
        description: 'O status do usuário',
    })

    @IsBoolean()
    status: boolean;
}