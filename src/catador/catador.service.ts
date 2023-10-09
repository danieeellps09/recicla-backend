import { Injectable, NotFoundException,Request } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CatadorDto } from './dto/create-catador.dto';
import { Catador } from './entities/catador.entity';
import { User } from 'src/user/entities/user.entity';
import { AuthRequest } from 'src/auth/models/AuthRequest';
@Injectable()
export class CatadorService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(catadorDto: CatadorDto,@Request() req: AuthRequest): Promise<Catador> {
    const user = req.user as User;
    const { associacao, veiculos: nomesVeiculos } = catadorDto;

    const veiculosCriados: { id: number }[] = [];
  
    for (const nomeVeiculo of nomesVeiculos) {
      let veiculo = await this.prismaService.veiculo.findUnique({
        where: { nomeVeiculo: nomeVeiculo },
      });
  
      if (!veiculo) {
        veiculo = await this.prismaService.veiculo.create({
          data: {
            nomeVeiculo: nomeVeiculo,
          },
        });
      }
  
veiculosCriados.push({ id: veiculo.id });
    }
  
    const catador = await this.prismaService.catador.create({
      data: {
        associacao,
        veiculos: {
          connect: veiculosCriados.map((veiculo) => ({ id: veiculo.id })),
        },
      },
      include: {
        veiculos: true,
      },
    });
  
    if (!catador) {
      throw new NotFoundException('Failed to create catador');
    }
  
    return catador;
  }

  async findAll(): Promise<Catador[]> {
    return this.prismaService.catador.findMany({
        include: {
          user: true, 
        },
      });
}

  async findOne(id: number): Promise<Catador> {
   const catador = await this.prismaService.catador.findUnique({
    where: { id },
    include: {
      user: true, 
    },
  });

  if (!catador) {
    throw new NotFoundException('Catador not found');
  }

  return catador;
  }

  async update(id: number, catador: Catador): Promise<Catador> {
    return this.prismaService.catador.update({
      where: { id },
      data: catador,
    });
  }

  async remove(id: number): Promise<void> {
    await this.prismaService.catador.delete({
      where: { id },
    });
  }


  async getVeiculoByName(nomeVeiculo: string): Promise<Veiculo | null> {
    const veiculo = await this.prismaService.veiculo.findUnique({
      where: { nomeVeiculo },
    });
  
    return veiculo;
  }

 
}
