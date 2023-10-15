import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class ChangePasswordDto {
    @ApiProperty({
        example: 'suasenha',
        description: 'senhadousuario',
      })
   @IsString()
    password: string;

}