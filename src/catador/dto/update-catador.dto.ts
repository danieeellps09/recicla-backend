import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { UpdateUserDto } from "src/user/dto/update-user.dto";
import { Type } from "class-transformer";
import { IsCpfValid } from "src/decorators/cpf.decorator";

export class UpdateCatadorDto {

    @ApiProperty({
        example: '000.000.000-00',
        description: 'O CPF do catador',
    })

    @IsOptional()
    @IsString()
    @IsCpfValid({message: "CPF inválido!"})
    cpf: string;

    @ApiProperty({ type: UpdateUserDto })
    @ValidateNested()
    @Type(() => UpdateUserDto)
    user: UpdateUserDto;

    @ApiProperty({
        example: 'Mucuripe',
        description: 'O nome do bairro',
    })

    @IsString()
    bairro: string;

    @ApiProperty({
        example: 'Rua 305, Conjunto São Cristóvão',
        description: 'O endereco ',
    })

    @IsString()
    endereco: string;

    @ApiProperty({ example: 1, description: 'Identificador da associação', })
    @IsNumber()
    associacaoId: number;

    @ApiProperty({
        example: 1,
        description: 'O identificador da etnia',
      })
    
      @IsNumber()
      idEtnia: number;
    
      @ApiProperty({
        example: 1,
        description: 'O identificador do gênero',
      })
    
      @IsNumber()
      idGenero: number;

}