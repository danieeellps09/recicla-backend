import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsString, ValidateNested } from "class-validator";
import { IsCpfValid } from "src/decorators/cpf.decorator";
import { CreateUserDto } from "src/user/dto/create-user.dto";

export class CreateAdminDto {

    @ApiProperty({ type: CreateUserDto })
    @ValidateNested()
    @Type(() => CreateUserDto)
    user: CreateUserDto;

    @ApiProperty({
        example: '000.000.000-00',
        description: 'O CPF do catador',
    })

    @IsString()
    @IsCpfValid({message: "CPF inválido!"})
    cpf?: string;
}