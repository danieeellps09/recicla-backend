import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, Request } from '@nestjs/common';
import { Associacao, Catador, Coleta, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterColetaDto } from './dto/register-coleta-dto';
import { AuthRequest } from 'src/auth/models/AuthRequest';
import { CatadorService } from 'src/catador/catador.service';
import { CurrentUserLogged } from 'src/auth/decorators/current-users-decorator';
import { UpdateColetaDto } from './dto/update-coleta-dto';
import {parse, format, isDate} from 'date-fns';

@Injectable()
export class ColetaService {
  constructor(private readonly prismaService: PrismaService,
    private readonly catadorService: CatadorService) {

  }




  async create(registerColetaDto: RegisterColetaDto, @Request() req: AuthRequest): Promise<Coleta> {
    const userId = req.user.id;

    if (!userId) {
      throw new NotFoundException('user  nao encontrado');
    }
    const idCatador = await this.catadorService.getCatadorByUserID(userId)

    if (!idCatador) {
      throw new NotFoundException('Usuário não é um catador.');
    }

    let dataConvertida: Date;

    if (registerColetaDto.dataColeta && isDate(parse(registerColetaDto.dataColeta, 'dd/MM/yyyy', new Date()))) {
      dataConvertida = parse(registerColetaDto.dataColeta, 'dd/MM/yyyy', new Date());
    } else {
      dataConvertida = new Date();
    }

    if (registerColetaDto.pergunta === (!registerColetaDto.motivo || registerColetaDto.motivo.trim() === '')) {
      throw new BadRequestException('O campo motivo é obrigatório quando pergunta é falsa.');
    }

      const dataPrisma: Date = new Date(dataConvertida.toISOString());
    const data = {
      id: registerColetaDto.id,
      idCatador: idCatador.id,
      idAssociacao: registerColetaDto.idAssociacao,
      idVeiculo: registerColetaDto.idVeiculo,
      quantidade: registerColetaDto.quantidade,
      pergunta: registerColetaDto.pergunta,
      motivo:  registerColetaDto.motivo || null,
      dataColeta: dataPrisma
    };



    const coleta = await this.prismaService.coleta.create({ data });

    if (!coleta) {
      throw new NotFoundException('Failed to create coleta');
    }

    return coleta;
  }


  async findAll(): Promise<Coleta[]> {
    try {
      return this.prismaService.coleta.findMany();
    } catch (error) {
      throw new InternalServerErrorException('Erro ao buscar associações.');
    }
  }


  async findById(id: number): Promise<Coleta> {
    try {
      const coleta = await this.prismaService.coleta.findUnique({
        where: { id }
      });

      if (!coleta) {
        throw new NotFoundException('Coleta  não encontrada.');
      }

      return coleta;
    } catch (error) {
      throw new NotFoundException('Coleta não encontrada.');
    }
  }

  async update(id: number, coleta: UpdateColetaDto): Promise<Coleta> {
    try {
        return await this.prismaService.coleta.update({
            where: { id },
            data: coleta
        });
    } catch (error) {
        throw new InternalServerErrorException('Erro ao atualizar associação.');
    }
}

async delete(id: number): Promise<void> {
    try {
        await this.prismaService.coleta.delete({
            where: { id }
        });
    } catch (error) {
        throw new InternalServerErrorException('Erro ao apagar associação.');
    }
}


}
