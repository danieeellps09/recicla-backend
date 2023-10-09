import { Injectable, NotFoundException,Request } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCatadorDto } from './dto/create-catador.dto';
import { Catador } from './entities/catador.entity';
import { User } from 'src/user/entities/user.entity';
import { AuthRequest } from 'src/auth/models/AuthRequest';
import { UpdateCatadorDto } from './dto/update-catador.dto';
@Injectable()
export class CatadorService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createCatadorDto: CreateCatadorDto,@Request() req: AuthRequest): Promise<Catador> {
    const user = req.user as User;
    
  const data = {
    id: createCatadorDto.id,
    userId: user.id,
    associacao: createCatadorDto.associacao
  }
    const catador = await this.prismaService.catador.create({data});
  
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

  async update(id: number, updateCatadorDto: UpdateCatadorDto): Promise<Catador> {
    return this.prismaService.catador.update({
      where: { id },
      data: updateCatadorDto,
    });
  }

  async remove(id: number): Promise<void> {
    await this.prismaService.catador.delete({
      where: { id },
    });
  }


 

 
}
