import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { NewAssociacao } from './dto/new-associacao.dto';
import { Associacao } from '@prisma/client';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AssociacoesService {
    constructor(private readonly prismaService:PrismaService, private readonly userService:UserService){}

    async create(newAssociacao:NewAssociacao):Promisse<Associacao>{
        const user = await this.userService.findById(newAssociacao.userId);
        if(!user){
            throw new NotFoundException(`Não foi possível encontrar usuário de id ${newAssociacao.userId}`);
        }

        const data = {
            
        }
    } 
}
