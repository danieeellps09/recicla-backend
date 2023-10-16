import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Material } from './entities/material.entity';
import { throws } from 'assert';
import { UpdateMaterial } from './dto/update-material.dto';

@Injectable()
export class MaterialService {
    constructor(private readonly prismaService: PrismaService) {}

    async create(nomeMaterial:string):Promise<Material>{
        const data = {
            nome: nomeMaterial
        }
        
        const material = this.prismaService.material.create({data});

        if(!material){
            throw new BadRequestException("Faild to create material");
        }

        return material;
    }

    async findAll():Promise<Material[]>{
        return this.prismaService.material.findMany({
            orderBy:{
                nome:'asc'
            }
        })
    }

    async findById(id:number):Promise<Material>{
        const material = this.prismaService.material.findUnique({
            where: {id}
        });
        if(!material){
            throw new NotFoundException(`Material com ${id} não encontrado.`);
        }
        return material;
    }

    async update(updateMaterial:UpdateMaterial):Promise<Material>{
        const id = updateMaterial.id;
        await this.findById(id);

        return await this.prismaService.material.update({
            where: { id },
            data: updateMaterial,
          });
    }

    async delete(id:number){
        await this.findById(id);

        return await this.prismaService.material.delete({
            where: {id}
        });
    }
}
