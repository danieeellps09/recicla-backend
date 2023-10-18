import { Injectable, NotFoundException } from '@nestjs/common';
import { Veiculo } from './entities/veiculo.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { NewVeiculo } from './dto/new-veiculo.dto';
import { UpdateVeiculo } from './dto/update-veiculo.dto';

@Injectable()
export class VeiculoService {
    constructor(private readonly prismaService: PrismaService) {}

    async create(newVeiculo: NewVeiculo):Promise<Veiculo>{
        const data = {
            nomeVeiculo: newVeiculo.nomeVeiculo
        }

        const veiculo = await this.prismaService.veiculo.create({data});

        if(!veiculo){
            throw new NotFoundException('Failed to create veiculo');
        }

        return veiculo;
    }

    async findAll():Promise<Veiculo[]>{
        return this.prismaService.veiculo.findMany({
            orderBy: {
                nomeVeiculo: 'asc'
            }
        })
    }

    async findById(id:number):Promise<Veiculo>{
        const veiculo = await this.prismaService.veiculo.findUnique({
            where: { id },
        });
        if(!veiculo){
            throw new NotFoundException(`Veículo com ID ${id} não encontrado.`);
        }
        return veiculo;
    }

    async update(id:number, updateVeiculo: UpdateVeiculo):Promise<Veiculo>{

        const veiculo = await this.prismaService.veiculo.findUnique({ where: { id } });
        if (!veiculo) {
          throw new NotFoundException(`Usuario com ${id} não encontrado`);
        }

        return await this.prismaService.veiculo.update({
            where: { id },
            data: updateVeiculo,
          });
    }

    async delete(id:number){
        await this.findById(id);

        return await this.prismaService.veiculo.delete({
            where: {id}
        });
    }
}
