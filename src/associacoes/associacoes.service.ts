import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { NewAssociacao } from './dto/new-associacao.dto';
import { Associacao } from './entities/associacao.entity';
import { UpdateAssociacaoDto } from './dto/update-associacao.dto';
import { UserService } from 'src/user/user.service';
import { RoleService } from 'src/role/role.service';
import { PasswordGenerator } from 'src/helpers/password-generator';
import { Catador } from '@prisma/client';
import { CatadorFormatadoJson } from '../catador/models/catador-sem-associacao';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class AssociacoesService {
    constructor(
        private readonly userService: UserService, 
        private readonly roleService: RoleService, 
        private readonly prismaService: PrismaService,
        private readonly emailService: EmailService) { }

    async create(newAssociacao: NewAssociacao): Promise<Associacao> {
        newAssociacao.user.roleNames = ["associacao"];
        let rolesIds = [];

        try {
            rolesIds = await this.userService.getRoleIdsByName(newAssociacao.user.roleNames);
        } catch (error) {
            const role = await this.roleService.create({
                id: null,
                name: "associacao",
                description: "Usuário associacao",
                status: true
            });
            rolesIds = [role.id];
        } finally {
            if (!newAssociacao.user.password) {
                newAssociacao.user.password = PasswordGenerator.generate(5);
            }

            await this.existsByCnpj(newAssociacao.cnpj);

            await this.userService.existsByEmail(newAssociacao.user.email);

            const user = await this.userService.create(newAssociacao.user);

            await this.userService.addRolesToUser(user.id, rolesIds);

            const data = {
                userId: user.id,
                cnpj: newAssociacao.cnpj,
                endereco: newAssociacao.endereco,
                bairro: newAssociacao.bairro
            };

            const associacao = await this.prismaService.associacao.create({
                data: data,
                include: {
                    user: true
                }
            });

            if (!associacao) {
                throw new InternalServerErrorException("Ocorreu um erro ao criar associação");
            }

            this.emailService.sendEmail(user.email, "Conta criada com sucesso",
                `Conta criada com sucesso! Sua senha para login é ${newAssociacao.user.password}. 
                Para trocar de senha, faça login na plataforma, vá em perfil e troque sua senha!`);

            return associacao;
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
        const existingAssociacao = await this.findById(id);
        const userId = existingAssociacao.userId;

        if (associacao.cnpj !== existingAssociacao.cnpj)
            await this.existsByCnpj(associacao.cnpj);

        if (associacao.user.email !== existingAssociacao.user.email)
            await this.userService.existsByEmail(associacao.user.email);

        await this.userService.update(userId, associacao.user);

        const data = {
            userId: userId,
            cnpj: associacao.cnpj,
            bairro: associacao.bairro,
            endereco: associacao.endereco
        };

        try {
            return await this.prismaService.associacao.update({
                where: { id },
                data: data,
                include: {
                    user: true
                }
            });
        } catch (error) {
            throw new InternalServerErrorException('Erro ao atualizar associação.');
        }
    }

    async disable(id: number): Promise<Associacao> {
        let associacao = await this.findById(id);
        const userId = associacao.user.id;
        associacao.user.status = false;

        await this.prismaService.user.update({
            where: { id },
            data: associacao.userId
        });

        return associacao;
    }

    async delete(id: number): Promise<void> {
        try {
            const associacao = await this.findById(id);
            await this.prismaService.associacao.delete({
                where: { id }
            });
            await this.userService.delete(associacao.user.id);
        } catch (error) {
            throw new BadRequestException('Erro ao apagar associação.');
        }
    }

    async existsByCnpj(cnpj: string): Promise<void> {
        const associacao = await this.prismaService.associacao.findUnique({
            where: {
                cnpj: cnpj
            }
        });

        if (associacao) {
            throw new BadRequestException("Já existe uma associacão com o CNPJ cadastrado.");
        }
    }

 

    async getAssociacaoByUserID(userId: number): Promise<Associacao> {
        try {
            const associacao = await this.prismaService.associacao.findFirst({
                where: {
                    userId: userId,
                },
            });


            return associacao;
        } catch (error) {
            throw new Error('Erro ao obter a Associação do banco de dados');
        }
    }
}
