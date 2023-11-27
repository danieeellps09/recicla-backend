import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";

export class UpdateEmail{
    @ApiProperty({
        example: 'fulanodasilva@example.com',
        description: 'O email do usuário',
    })

    @IsEmail()
    email: string;
}