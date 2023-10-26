import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { NewAssociacao } from './dto/new-associacao.dto';
import { Associacao } from './entities/associacao.entity';
import { UpdateAssociacaoDto } from './dto/update-associacao.dto';
import { UserService } from 'src/user/user.service';
import { RoleService } from 'src/role/role.service';
import { PasswordGenerator } from 'src/helpers/password-generator';

@Injectable()
export class AssociacoesService {
    constructor(private readonly userService: UserService, private readonly roleService: RoleService, private readonly prismaService: PrismaService) { }

    async create(newAssociacao: NewAssociacao): Promise<Associacao> {
        //seta o role como catador
        newAssociacao.user.roleNames = ["associacao"];
        let rolesIds = [];

        try {
            rolesIds = await this.userService.getRoleIdsByName(newAssociacao.user.roleNames);
        }
        catch (error) {
            const role = await this.roleService.create({
                id: null,
                name: "catador",
                description: "Usuário catador",
                status: true
            });
            rolesIds = [role.id];

        }
        finally {
            //cria uma senha alfanumérica randomica para o novo usuário
            if (!newAssociacao.user.password) {
                newAssociacao.user.password = PasswordGenerator.generate(5);
            }

            //cria o user
            const user = await this.userService.create(newAssociacao.user);

            //adiciona as roles
            await this.userService.addRolesToUser(user.id, rolesIds);

            const data = {
                userId: newAssociacao.user.id,
                cnpj: newAssociacao.cnpj,
                endereco: newAssociacao.endereco
            };

            //cria a associacao
            const associacao = await this.prismaService.associacao.create({ data });

            if (!associacao) {
                throw new InternalServerErrorException("Ocorreu um erro ao criar associação");
            }

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

        //pega o id do user que está relacionado com o catador
        const userId = (await this.findById(id)).userId;

        await this.userService.update(userId, associacao.user);

        const data = {
            userId: userId,
            cnpj: associacao.cnpj,
            bairro: associacao.bairro,
            endereco: associacao.endereco
        }
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

    async disable(id: number) {
        let associacao = await this.findById(id);
        const userId = associacao.user.id;
        associacao.user.status = false;
        const user = this.prismaService.user.update({
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
            await this.userService.delete((associacao).user.id)
        } catch (error) {
            throw new InternalServerErrorException('Erro ao apagar associação.');
        }
    }
}

