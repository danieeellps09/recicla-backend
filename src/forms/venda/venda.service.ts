import { Injectable, InternalServerErrorException, NotFoundException, Request } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthRequest } from 'src/auth/models/AuthRequest';
import {parse, format, isDate} from 'date-fns';
import { AssociacoesService } from 'src/associacoes/associacoes.service';
import { RegisterVendaDto } from './dto/register-venda-dto';
import { UpdateVendaDto } from './dto/update-venda-dto';
import { VendaMaterialDto } from './dto/venda-produto.dto';
import { MaterialService } from 'src/material/material.service';
import { Venda } from './entities/venda.entity';

@Injectable()
export class VendaService {
  constructor(private readonly prismaService: PrismaService,
    private readonly associacaoService: AssociacoesService,
    private readonly materialService: MaterialService) {
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
      notaFiscal: registerVendaDto.notaFiscal,
      dataVenda: dataPrisma
    };

    const venda = await this.prismaService.venda.create({ data });

    if (!venda) {
      throw new NotFoundException('Failed to create venda');
    }

    try{
      const produtos = registerVendaDto.produtos.map(async (produto)=> await this.createMaterialVenda(venda.id, produto));
    }catch(error){
      await this.delete(venda.id);
    }

    return venda;
  }

  async createMaterialVenda(idVenda:number, produto:VendaMaterialDto){
    const material = await this.materialService.findById(produto.idProduto);
    const data = {
      idVenda: idVenda,
      idMaterial: produto.idProduto,
      quantidadeVendida: produto.quantidade
    }
    return await this.prismaService.vendaProduto.create({
      data,
      include:{
        Material: true
      }
    });
  }


  async findAll(): Promise<Venda[]> {
    try {
      return this.prismaService.venda.findMany({
        include:{
          Materiais: true
        }
      });
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
