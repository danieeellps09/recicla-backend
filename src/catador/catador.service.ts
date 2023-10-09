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
    const data = {
        userId: user.id,
        associacao: catadorDto.associacao,
        veiculo: catadorDto.veiculo
    }
    const Catador =  await this.prismaService.catador.create({data});
    return Catador
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
      user: true, // Inclua o relacionamento com o usuário
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
}
