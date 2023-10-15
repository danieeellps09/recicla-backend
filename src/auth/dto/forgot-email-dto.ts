import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";

export class ForgotEmailDto {
    @ApiProperty({
        example: 'daniel-lps@hotmail.com.br',
        description: 'email do usuario',
      })
      @IsEmail()
    email: string;

}