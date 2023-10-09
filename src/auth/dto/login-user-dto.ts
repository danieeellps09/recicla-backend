import { ApiProperty } from "@nestjs/swagger";

export class LoginDTO {
    @ApiProperty({
        example: 'gianfelipe@example.com',
        description: 'associacao do catador',
      })
    email: string;
  
    @ApiProperty({
        example: 'suasenha',
        description: 'senha do usuario',
      })
    password: string;
}