import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEmail, IsNumber, IsOptional, IsString } from "class-validator";

export class ReturnUserDto {
    @IsNumber()
    id: number;

    @ApiProperty({ example: 'Gian Silva', description: 'Nome do usuário' })
    @IsString()
    name?: string;

    @ApiProperty({ example: 'gianfelipe@example.com', description: 'E-mail do usuário' })
    @IsEmail()
    email?: string;

    @ApiProperty({ example: '(11) 99999-9999', description: 'Telefone do usuário' })
    @IsString()
    phone?: string;

    @ApiProperty({
        example: 'true',
        description: 'O status do usuário',
    })

    @IsBoolean()
    status: boolean;
}