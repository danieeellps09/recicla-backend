import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Genero } from './genero.entity';

@Injectable()
export class GeneroService {
    constructor(private readonly prismaService:PrismaService){}

    async create(nomenclatura:string):Promise<Genero>{
        const genero = await this.prismaService.genero.create({
            data: {nomenclatura:nomenclatura}
        });

        if(!genero){
            throw new BadRequestException("Não foi possível salvar genero");
        }
        return genero;
    }

    async findAll():Promise<Genero[]>{
        return await this.prismaService.genero.findMany({
            orderBy: {nomenclatura: 'asc'}
        })
    }

    async findById(id:number):Promise<Genero>{
        const genero = await this.prismaService.genero.findUnique({
            where: {id}
        });

        if(!genero){
            throw new NotFoundException(`Genero de id ${id} não encontrada!`);
        }

        return genero;
    }

    async update(id:number, nomenclatura:string):Promise<Genero>{
        await this.findById(id);
        
        const data = {
            id:id,
            nomenclatura:nomenclatura
        }

        const genero = this.prismaService.genero.update({
            where: {id},
            data:data
        })

        if(!genero){
            throw new BadRequestException("Não foi possível atualizar os campos de genero.");
        }

        return genero;
    }

    async delete(id:number){
        this.findById(id);
        await this.prismaService.genero.delete({
            where:{id}
        })
    }
}
