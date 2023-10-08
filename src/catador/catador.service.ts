import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CatadorDto } from './dto/create-catador.dto';
import { Catador } from './entities/catador.entity';
@Injectable()
export class CatadorService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(catadorDto: CatadorDto): Promise<Catador> {

    const data = {
        id: catadorDto.id,
        userId: catadorDto.userId,
        assosciacao: catadorDto.associacao,
        tipoDeVeiculo: catadorDto.veiculo
    }
    const Catador =  await this.prismaService.catador.create({data});
    return Catador
  }

  async findAll(): Promise<Catador[]> {
    return this.prismaService.catador.findMany();
  }

  async findOne(id: number): Promise<Catador> {
    const catador = await this.prismaService.catador.findUnique({
      where: { id },
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
}
