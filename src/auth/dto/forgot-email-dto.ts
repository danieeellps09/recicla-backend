import { ApiProperty } from "@nestjs/swagger";

export class ForgotEmailDto {
    @ApiProperty({
        example: 'gianfelipe@example.com',
        description: 'email do usuario',
      })
    email: string;

}