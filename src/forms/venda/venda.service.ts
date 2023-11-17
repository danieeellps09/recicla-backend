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
import { VendaMaterial } from './entities/venda-material.entity';

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

    const venda:Venda = await this.prismaService.venda.create({
      data,
      include: {
        associacao: true
      } 
    });

    if (!venda) {
      throw new NotFoundException('Failed to create venda');
    }

    try{
      const materiais = await Promise.all(registerVendaDto.produtos.map(async (produto)=> await this.createMaterialVenda(venda.id, produto)));
      venda.materiais = materiais;
    }catch(error){
      await this.delete(venda.id);
      throw new NotFoundException("Algum dos materiais referênciados não existe no banco de dados");
    }

    return venda;
  }

  private async createMaterialVenda(idVenda:number, produto:VendaMaterialDto):Promise<VendaMaterial>{
    const material = await this.materialService.findById(produto.idMaterial);
    const data = {
      idVenda: idVenda,
      idMaterial: produto.idMaterial,
      quantidadeVendida: produto.quantidade
    }
    return await this.prismaService.vendaProduto.create({
      data,
      include:{
        material: true
      }
    });
  }

  private async findMaterialVendaByIdVenda(idVenda:number):Promise<VendaMaterial[]>{
    try{
      return await this.prismaService.vendaProduto.findMany({
        where:{
          idVenda: idVenda
        },
        include:{
          material:true
        }
      });
    }catch(error){
      throw new InternalServerErrorException("Ocorreu um erro ao buscar por materiais da venda.");
    }
  }

  private async findMaterialVendaById(id:number):Promise<VendaMaterial[]>{
    try{
      return await this.prismaService.vendaProduto.findMany({
        where:{
          id
        },
        include:{
          material:true
        }
      });
    }catch(error){
      throw new InternalServerErrorException("Ocorreu um erro ao buscar por materiais da venda.");
    }
  }


  async findAll(): Promise<Venda[]> {
    try {
      let vendas = await this.prismaService.venda.findMany({
        include:{
          materiais: true
        }
      });

      for (let venda of vendas) {
        venda.materiais = await this.findMaterialVendaByIdVenda(venda.id);
      }

      return vendas;
    } catch (error) {
      throw new InternalServerErrorException('Erro ao buscar por vendas.');
    }
  }


  async findById(id: number): Promise<Venda> {
    try {
      let venda = await this.prismaService.venda.findUnique({
        where: { id },
        include:{
          materiais:true
        }
      });

      if (!venda) {
        throw new NotFoundException('Venda  não encontrada.');
      }

      venda.materiais = await this.findMaterialVendaByIdVenda(venda.id);

      return venda;
    } catch (error) {
      throw new NotFoundException('Venda não encontrada.');
    }
  }

  async findBetweenDates(dataInicio: Date, dataFim: Date):Promise<Venda[]>{
    try{
      return await this.prismaService.venda.findMany({
        where:{
          dataVenda:{
            gte: dataInicio,
            lte: dataFim
          }
        },
        orderBy:{
          dataVenda: 'desc'
        }
      });
    }catch(error){
      throw new InternalServerErrorException("Ocorreu um erro ao buscar por coletas.");
    }
  }

  async findByAssociacaoAndBetweenDates(idAssociacao:number, dataInicio: Date, dataFim: Date):Promise<Venda[]>{
    try{
      return await this.prismaService.venda.findMany({
        where:{
          idAssociacao: idAssociacao,
          AND:{
            dataVenda:{
              gte: dataInicio,
              lte: dataFim
            }
          }
        },
        orderBy:{
          dataVenda: 'desc'
        }
      });
    }catch(error){
      throw new InternalServerErrorException("Ocorreu um erro ao buscar por coletas.");
    }
  }

  async findVendasByAssociacaoUserId(userId: number): Promise<Venda[]> {
    try {
      // Obtenha a associação com base no ID do usuário
      const associacao = await this.associacaoService.getAssociacaoByUserID(userId);

      if (!associacao) {
        throw new NotFoundException('Associação não encontrada para o usuário.');
      }

      // Use o ID da associação para filtrar as vendas
      let vendas = await this.prismaService.venda.findMany({
        where: {
          idAssociacao: associacao.id,
        },
        include: {
          materiais: true,
        },
      });

      for (let venda of vendas) {
        venda.materiais = await this.findMaterialVendaByIdVenda(venda.id);
      }

      return vendas;
    } catch (error) {
      throw new Error('Erro ao buscar vendas por associação: ' + error.message);
    }
  }



  

  async update(id: number, venda: UpdateVendaDto): Promise<Venda> {
    try {
      await this.findById(id);
      return await this.prismaService.venda.update({
        where: { id },
        data: {
          id: id,
          empresaCompradora: venda.empresaCompradora,
          idAssociacao: venda.idAssociacao,
          notaFiscal: venda.notaFiscal
        }
      });
    } catch (error) {
        throw new InternalServerErrorException('Erro ao atualizar venda.');
    }
}

private async deleteVendaMaterialByIdVenda(idVenda:number){
  await this.prismaService.vendaProduto.deleteMany({
    where: {
      idVenda: idVenda
    }
  })
}

async delete(id: number): Promise<void> {
    try {
        const venda = await this.findById(id);

        await this.deleteVendaMaterialByIdVenda(venda.id);
        await this.prismaService.venda.delete({
            where: { id }
        });
    } catch (error) {
        throw new InternalServerErrorException('Erro ao apagar venda.');
    }
}


}
