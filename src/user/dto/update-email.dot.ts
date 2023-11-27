import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";

export class UpdateEmail{
    @ApiProperty({
        example: 'M1nh453nh4',
        description: 'A senha do usuário',
    })

    @IsEmail()
    email: string;
}