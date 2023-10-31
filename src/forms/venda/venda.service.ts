import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, Request } from '@nestjs/common';
import { Associacao, Catador, Coleta, User, Venda } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthRequest } from 'src/auth/models/AuthRequest';
import { CatadorService } from 'src/catador/catador.service';
import { CurrentUserLogged } from 'src/auth/decorators/current-users-decorator';
import {parse, format, isDate} from 'date-fns';
import { AssociacoesService } from 'src/associacoes/associacoes.service';
import { RegisterVendaDto } from './dto/register-venda-dto';
import { UpdateVendaDto } from './dto/update-venda-dto';

@Injectable()
export class VendaService {
  constructor(private readonly prismaService: PrismaService,
    private readonly associacaoService: AssociacoesService) {

  }




  async create(registerVendaDto: RegisterVendaDto, @Request() req: AuthRequest): Promise<Venda> {
    const userId = req.user.id;

    if (!userId) {
      throw new NotFoundException('user  nao encontrado');
    }
    const idAssociacao = await this.associacaoService.getAssociacaoByUserID(userId)

    if (!idAssociacao) {
      throw new NotFoundException('Usuário não é uma associação.');
    }

    let dataConvertida: Date;

    if (registerVendaDto.dataVenda && isDate(parse(registerVendaDto.dataVenda, 'dd/MM/yyyy', new Date()))) {
      dataConvertida = parse(registerVendaDto.dataVenda, 'dd/MM/yyyy', new Date());
    } else {
      dataConvertida = new Date();
    }

      const dataPrisma: Date = new Date(dataConvertida.toISOString());
    const data = {
      id: registerVendaDto.id,
      idAssociacao: idAssociacao.id,
      empresaCompradora: registerVendaDto.empresaCompradora,
      qtdVendida: registerVendaDto.qtdVendida,
      notaFiscal: registerVendaDto.notaFiscal,
      dataVenda: dataPrisma
    };



    const venda = await this.prismaService.venda.create({ data });

    if (!venda) {
      throw new NotFoundException('Failed to create venda');
    }

    return venda;
  }


  async findAll(): Promise<Venda[]> {
    try {
      return this.prismaService.venda.findMany();
    } catch (error) {
      throw new InternalServerErrorException('Erro ao buscar associações.');
    }
  }


  async findById(id: number): Promise<Venda> {
    try {
      const venda = await this.prismaService.venda.findUnique({
        where: { id }
      });

      if (!venda) {
        throw new NotFoundException('Venda  não encontrada.');
      }

      return venda;
    } catch (error) {
      throw new NotFoundException('Venda não encontrada.');
    }
  }

  async update(id: number, coleta: UpdateVendaDto): Promise<Venda> {
    try {
        return await this.prismaService.venda.update({
            where: { id },
            data: coleta
        });
    } catch (error) {
        throw new InternalServerErrorException('Erro ao atualizar associação.');
    }
}

async delete(id: number): Promise<void> {
    try {
        await this.prismaService.venda.delete({
            where: { id }
        });
    } catch (error) {
        throw new InternalServerErrorException('Erro ao apagar associação.');
    }
}


}
