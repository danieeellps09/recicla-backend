import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsString, ValidateNested } from "class-validator";
import { IsCpfValid } from "src/decorators/cpf.decorator";
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

    @IsString()
    @IsCpfValid({message: "CPF inválido!"})
    cpf: string;
}