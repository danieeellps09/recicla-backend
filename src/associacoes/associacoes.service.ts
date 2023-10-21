import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { NewAssociacao } from './dto/new-associacao.dto';
import { Associacao } from './entities/associacao.entity';
import { AuthRequest } from 'src/auth/models/AuthRequest';
import { User } from 'src/user/entities/user.entity';
import { UpdateAssociacaoDto } from './dto/update-associacao.dto';

@Injectable()
export class AssociacoesService {
    constructor(private readonly prismaService:PrismaService){}

    async create(newAssociacao:NewAssociacao, req: AuthRequest):Promise<Associacao>{
        const user = req.user as User;
        if(!user){
            throw new NotFoundException(`Não foi possível encontrar usuário de id ${user.id}`);
        }

        const data = {
            userId: user.id,
            cnpj: newAssociacao.cnpj,
            endereco: newAssociacao.endereco
        };

        const associacao = await this.prismaService.associacao.create({data});

        if(!associacao){
            throw new InternalServerErrorException("Ocorreu um erro ao criar associação");
        }

        return associacao;
    }

    async findAll():Promise<Associacao[]>{
        return this.prismaService.associacao.findMany({
            include: {
                user:true
            }
        });
    }

    async findById(id:number):Promise<Associacao>{
        const associacao = await this.prismaService.associacao.findUnique({
            where: {id},
            include: {
                user: true
            }
        });

        if(!associacao){
            throw new NotFoundException("Associação não encontrada");
        }

        return associacao;
    }

    async update(id:number, associacao:UpdateAssociacaoDto):Promise<Associacao>{
        return await this.prismaService.associacao.update({
            where: {id},
            data: associacao
        })
    }

    async delete(id:number){
        await this.prismaService.associacao.delete({
            where: {id}
        });
    }
}
