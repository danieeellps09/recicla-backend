import { Injectable, NotFoundException } from '@nestjs/common';
import { Associacao, Catador } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterColetaDto } from './dto/register-coleta-dto';
import { CatadorRequest } from './models/CatadorRequest';

@Injectable()
export class ColetaService {
    constructor(private readonly prismaService: PrismaService) {

    }




    async create(registerColetaDto: RegisterColetaDto, @Request() req:CatadorRequest): Promise<Catador> {
        const catadores = req.catador as Catador;
        

        const data = {
            id: registerColetaDto.id,
            idCatador: catadores.id,
            idAssociacao: registerColetaDto.idAssociacao,
            idVeiculo: registerColetaDto.idVeiculo,
            quantidade: registerColetaDto.quantidade,
            pergunta: registerColetaDto.pergunta


        };
        const catador = await this.prismaService.coleta.create({ data });

        if (!catador) {
            throw new NotFoundException('Failed to create catador');
        }

        return catador;
    }

}
