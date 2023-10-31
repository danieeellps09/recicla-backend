import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsNumber, IsOptional, IsString } from 'class-validator';
import { RegisterColetaDto } from './register-coleta-dto';

export class UpdateColetaDto extends PartialType(RegisterColetaDto) {

 
    @ApiProperty({
        example: '1',
        description: 'Id da associacao do catador',
      })
      @IsNumber()
      idAssociacao: number;
    
    
      @ApiProperty({
        example: '1',
        description: 'Id do veiculo que foi usado',
      })
      @IsNumber()
      idVeiculo: number;
    
      @ApiProperty({
        example: '32132',
        description: 'Quantidade coletada',
      })
      
      @IsNumber()
      quantidade: number;
      
    
      @ApiProperty({
        example: false,
        description: 'Todos os pontos foram visitados?' ,
      })
    
      @IsBoolean()
      pergunta: boolean;
    
      @ApiProperty({     
        example: 'Não deu certo pois tive que terminar mais cedo',
        description: 'motivo se a pergunta for falsa' ,
      })
    
      @IsString()
      motivo: string;

      @IsString()
      dataColeta: string;
}