import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class UpdateSenha {
    @ApiProperty({
        example: 'M1nh453nh4',
        description: 'A senha do usuário',
    })

    @IsString()
    password: string;
}