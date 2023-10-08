import { ApiProperty } from "@nestjs/swagger";

export class LoginDTO {
    @ApiProperty()
    login: string;
  
    @ApiProperty()
    password: string;
}