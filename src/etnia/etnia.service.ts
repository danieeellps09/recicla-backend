import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Etnia } from './entities/etnia.entity';

@Injectable()
export class EtniaService {
    constructor(private readonly prismaService:PrismaService){}

    async create(nomenclatura:string):Promise<Etnia>{
        await this.existsEtnia(nomenclatura);
        const etnia = await this.prismaService.etnia.create({
            data: {nomenclatura:nomenclatura}
        });

        if(!etnia){
            throw new BadRequestException("Não foi possível salvar etnia");
        }
        return etnia;
    }

    async findAll():Promise<Etnia[]>{
        return await this.prismaService.etnia.findMany({
            orderBy: {nomenclatura: 'asc'}
        })
    }

    async findById(id:number):Promise<Etnia>{
        const etnia = await this.prismaService.etnia.findUnique({
            where: {id}
        });

        if(!etnia){
            throw new NotFoundException(`Etnia de id ${id} não encontrada!`);
        }

        return etnia;
    }

    async update(id:number, nomenclatura:string):Promise<Etnia>{
        await this.findById(id);
        
        const data = {
            id:id,
            nomenclatura:nomenclatura
        }

        const etnia = this.prismaService.etnia.update({
            where: {id},
            data:data
        })

        if(!etnia){
            throw new BadRequestException("Não foi possível atualizar os campos de etnia.");
        }

        return etnia;
    }

    async delete(id:number){
        await this.findById(id);
        await this.prismaService.etnia.delete({
            where:{id}
        })
    }


    
    async existsEtnia(etnia:string){
        const existsEtnia = await this.prismaService.etnia.findUnique({
          where:{
            nomenclatura: etnia,
          }
        });
        if(existsEtnia){
          throw new BadRequestException("Já existe uma nomenclatura cadastrada.");
        }   
      }





}
