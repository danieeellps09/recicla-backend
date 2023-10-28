import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { NewAssociacao } from './dto/new-associacao.dto';
import { Associacao } from './entities/associacao.entity';
import { AuthRequest } from 'src/auth/models/AuthRequest';
import { User } from 'src/user/entities/user.entity';
import { UpdateAssociacaoDto } from './dto/update-associacao.dto';

@Injectable()
export class AssociacoesService {
    constructor(private readonly prismaService: PrismaService) {}

    async create(newAssociacao: NewAssociacao, req: AuthRequest): Promise<Associacao> {
        try {
            const user = req.user as User;
            if (!user) {
                throw new NotFoundException(`Não foi possível encontrar usuário de id ${user.id}`);
            }

            const data = {
                userId: user.id,
                cnpj: newAssociacao.cnpj,
                endereco: newAssociacao.endereco
            };

            const associacao = await this.prismaService.associacao.create({ data });

            if (!associacao) {
                throw new InternalServerErrorException("Ocorreu um erro ao criar associação");
            }

            return associacao;
        } catch (error) {
            throw new InternalServerErrorException('Erro ao criar associação.');
        }
    }

    async findAll(): Promise<Associacao[]> {
        try {
            return this.prismaService.associacao.findMany({
                include: {
                    user: true
                }
            });
        } catch (error) {
            throw new InternalServerErrorException('Erro ao buscar associações.');
        }
    }

    async findById(id: number): Promise<Associacao> {
        try {
            const associacao = await this.prismaService.associacao.findUnique({
                where: { id },
                include: {
                    user: true
                }
            });

            if (!associacao) {
                throw new NotFoundException('Associação não encontrada.');
            }

            return associacao;
        } catch (error) {
            throw new NotFoundException('Associação não encontrada.');
        }
    }

    async update(id: number, associacao: UpdateAssociacaoDto): Promise<Associacao> {
        try {
            return await this.prismaService.associacao.update({
                where: { id },
                data: associacao
            });
        } catch (error) {
            throw new InternalServerErrorException('Erro ao atualizar associação.');
        }
    }

    async delete(id: number): Promise<void> {
        try {
            await this.prismaService.associacao.delete({
                where: { id }
            });
        } catch (error) {
            throw new InternalServerErrorException('Erro ao apagar associação.');
        }
    }

    async getAssociacaoByUserID(userId:number){
        try {
            const associacao = await this.prismaService.associacao.findFirst({
              where: {
                userId: userId,
              },
            });
            return associacao;
          } catch (error) {
            throw new Error('Erro ao obter o Associacao do banco de dados');
          }

    }

}

