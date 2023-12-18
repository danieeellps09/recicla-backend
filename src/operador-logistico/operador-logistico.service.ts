import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { EmailService } from 'src/email/email.service';
import { PasswordGenerator } from 'src/helpers/password-generator';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRoleDto } from 'src/role/dto/create-role.dto';
import { RoleService } from 'src/role/role.service';
import { UserService } from 'src/user/user.service';
import { CreateOperadorDto } from './dto/create-operador.dto';
import { UpdateOperadorDto } from './dto/update-operador.dto';
import { Operador } from './entities/operador.entity';

@Injectable()
export class OperadorLogisticoService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly userService: UserService,
        private readonly roleService: RoleService,
        private readonly emailService: EmailService,
        private readonly createRoleDto: CreateRoleDto) { }

    async create(createOperadorDto: CreateOperadorDto): Promise<Operador> {
        createOperadorDto.user.roleNames = ["operador"];
        let rolesIds = [];

        try {
            rolesIds = await this.userService.getRoleIdsByName(createOperadorDto.user.roleNames);
        } catch (error) {
            
            const role = await this.roleService.create({
                id: this.createRoleDto.id,
                name: "operador",
                description: "Usuário operador",
                status: true
            });
            rolesIds = [role.id];
        } finally {
            if (!createOperadorDto.user.password) {
                createOperadorDto.user.password = PasswordGenerator.generate(5);
            }

            await this.existsByCpf(createOperadorDto.cpf);

            await this.userService.existsByEmail(createOperadorDto.user.email);

            const user = await this.userService.create(createOperadorDto.user);

            await this.userService.addRolesToUser(user.id, rolesIds);

            const data = {
                userId: user.id,
                cpf: createOperadorDto.cpf
                
            }

            const operador = await this.prismaService.operadorlogistico.create({ 
                data:data,
                include:{
                    user:true
                } 
            });

            if (!operador) {
                throw new InternalServerErrorException("Ocorreu um erro ao cadastrar operador.");
            }

            this.emailService.sendEmail(user.email, "Conta criada com sucesso",
                `Conta criada com sucesso! Sua senha para login é ${createOperadorDto.user.password}. 
                Para trocar de senha, faça login na plataforma, vá em perfil e troque sua senha!`);

            return operador;

        }
    }

    async findAll(): Promise<Operador[]> {
        return await this.prismaService.operadorlogistico.findMany({
            include: {
                user: true
            }
        })
    }

    async findById(id: number): Promise<Operador> {
        const operador = await this.prismaService.operadorlogistico.findUnique({
            where: { id },
            include: {
                user: true
            }
        });

        if (!operador) {
            throw new NotFoundException(`Operador de id ${id} não encontrado`);
        }

        return operador;
    }

    async update(id: number, updateOperadorDto: UpdateOperadorDto): Promise<Operador> {
        const operador = (await this.findById(id));
        const userId = operador.user.id;

        if(updateOperadorDto.cpf !== operador.cpf){
            await this.existsByCpf(updateOperadorDto.cpf);
        }

        if(updateOperadorDto.user.email !== operador.user.email){
            await this.userService.existsByEmail(updateOperadorDto.user.email);
        }
        
        await this.userService.update(userId, updateOperadorDto.user);

        const data = {
            id: id,
            userId: userId,
            cpf: updateOperadorDto.cpf
        }

        return await this.prismaService.operadorlogistico.update({
            where: { id },
            data: data,
            include: {
                user: true
            },
        });
    }

    async delete(id) {
        const operador = await this.findById(id);
        await this.prismaService.operadorlogistico.delete({
            where: { id }
        });
        await this.userService.delete((operador).user.id);
    }

    async disable(id) {
        const operador = await this.findById(id);
        const userId = operador.user.id;
        operador.user.status = false;
        await this.prismaService.user.update({
            where: { id },
            data: operador.user.status
        });
        await this.userService.delete((operador).user.id);
    }

    async existsByCpf(cpf:string){
        const operadoristrador =  await this.prismaService.operadorlogistico.findUnique({
            where: {
                cpf:cpf
            }
        });

        if(operadoristrador){
            throw new BadRequestException('Já existe um operador logistico com o CPF cadastrado.');
        }
    }



}
