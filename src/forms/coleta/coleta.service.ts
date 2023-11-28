import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, Request } from '@nestjs/common';
import { Associacao, Catador, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterColetaDto } from './dto/register-coleta-dto';
import { AuthRequest } from 'src/auth/models/AuthRequest';
import { CatadorService } from 'src/catador/catador.service';
import { CurrentUserLogged } from 'src/auth/decorators/current-users-decorator';
import { UpdateColetaDto } from './dto/update-coleta-dto';
import {parse, format, isDate, endOfDay, startOfDay} from 'date-fns';
import { Coleta } from './entities/coleta.entity';

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

    const idAssociacao = idCatador.associacaoId;


      const dataPrisma: Date = new Date(dataConvertida.toISOString());

      let motivo: string | null = null;

      if (!registerColetaDto.pergunta) {
          if (!registerColetaDto.motivo || registerColetaDto.motivo.trim() === '') {
              throw new BadRequestException('Campo motivo é obrigatório quando pergunta é false.');
          }
          motivo = registerColetaDto.motivo.trim();
      }


      if (registerColetaDto.pergunta) {
        motivo = "";
    }

    const data = {
      id: registerColetaDto.id,
      idCatador: idCatador.id,
      idAssociacao: idAssociacao,
      idVeiculo: registerColetaDto.idVeiculo,
      quantidade: registerColetaDto.quantidade,
      numRota: registerColetaDto.numRota,
      pergunta: registerColetaDto.pergunta,
      motivo:  motivo,
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

  async findMyColetas(catadorId: number): Promise<Coleta[]> {
    try {
      // Utilize o Prisma para buscar as coletas do catador pelo ID do catador
      const coletas = await this.prismaService.coleta.findMany({
        where: {
          idCatador: catadorId,
        },
      });

      return coletas;
    } catch (error) {
      // Trate erros de forma apropriada, se necessário
      throw new Error('Erro ao buscar as coletas: ' + error.message);
    }
  }

  async findByCatadorAndBetweenDates(catadorId:number, dataInicio:Date, dataFim:Date):Promise<Coleta[]>{
    const catador =  await this.catadorService.findOne(catadorId);

    try{
      return await this.prismaService.coleta.findMany({
        where:{
          idCatador: catador.id,
          AND:{
            dataColeta:{
              gte: dataInicio,
              lte: dataFim
            }
          }
        },
        orderBy:{
          dataColeta: 'desc'
        },
        include:{
          catador: {
            include:{
              user:true
            }
          },
          associacao:{
            include:{
              user:true
            }
          },
          veiculo:true
        }
      });
    }
    catch(error){
      throw new InternalServerErrorException("Ocorreu um erro ao buscar por coletas.");
    }
  }

  async findBetweenDates(dataInicio:Date, dataFim:Date){
    try{
      return await this.prismaService.coleta.findMany({
        where:{
          dataColeta:{
              gte: dataInicio,
              lte: dataFim
          }
        },
        orderBy:{
          dataColeta: 'desc'
        },
        include:{
          catador: {
            include:{
              user:true
            }
          },
          associacao:{
            include:{
              user:true
            }
          },
          veiculo:true
        }
      });
    }catch(error){
      throw new InternalServerErrorException("Ocorreu um erro ao buscar por coletas.");
    }
  }


  async findBetweenDatesByCatador(catadorId: number, dataInicio: Date, dataFim: Date): Promise<Coleta[]> {
    try {
      // Utilize o Prisma para buscar as coletas entre as datas para o catador específico
     return await this.prismaService.coleta.findMany({
        where:{
          idCatador: catadorId,
          AND:{
            dataColeta:{
              gte: dataInicio,
              lte: dataFim
            }
          }
        },
        orderBy:{
          dataColeta: 'desc'
        },
        include:{
          catador: {
            include:{
              user:true
            }
          },
          associacao:{
            include:{
              user:true
            }
          },
          veiculo:true
        }
      });
    } catch (error) {
      throw new Error('Erro ao buscar as coletas entre as datas: ' + error.message);
    }
  }


  async findColetasByCatador(idCatador: number): Promise<Coleta[]> {
    try {
      const coletas = await this.prismaService.coleta.findMany({
        where: { idCatador: idCatador },
      });
      return coletas;
    } catch (error) {
      throw new Error('Erro ao buscar coletas do catador: ' + error.message);
    }
  }



  async update(id: number, coleta: UpdateColetaDto): Promise<Coleta> {
    try {
        return await this.prismaService.coleta.update({
            where: { id },
            data: coleta
        });
    } catch (error) {
        throw new InternalServerErrorException('Erro ao atualizar coleta.');
    }
}

async delete(id: number): Promise<void> {
    try {
        await this.prismaService.coleta.delete({
            where: { id }
        });
    } catch (error) {
        throw new InternalServerErrorException('Erro ao apagar coleta.');
    }
}


}
