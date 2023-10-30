import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ValidateNested } from "class-validator";
import { UpdateUserDto } from "src/user/dto/update-user.dto";

export class UpdateAdminDto {

    @ApiProperty({ type: UpdateUserDto })
    @ValidateNested()
    @Type(() => UpdateUserDto)
    user: UpdateUserDto;

    @ApiProperty({
        example: '000.000.000-00',
        description: 'O CPF do catador',
    })
    cpf: string;
}