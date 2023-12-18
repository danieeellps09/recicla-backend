import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Admin } from './entities/admin.entity';
import { UserService } from 'src/user/user.service';
import { RoleService } from 'src/role/role.service';
import { PasswordGenerator } from 'src/helpers/password-generator';
import { EmailService } from 'src/email/email.service';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { CreateRoleDto } from 'src/role/dto/create-role.dto';

@Injectable()
export class AdministradorService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly userService: UserService,
        private readonly roleService: RoleService,
        private readonly emailService: EmailService,
        private readonly createRoleDto: CreateRoleDto) { }

    async create(createAdminDto: CreateAdminDto): Promise<Admin> {
        createAdminDto.user.roleNames = ["admin"];
        let rolesIds = [];

        try {
            rolesIds = await this.userService.getRoleIdsByName(createAdminDto.user.roleNames);
        } catch (error) {
            
            const role = await this.roleService.create({
                id: this.createRoleDto.id,
                name: "admin",
                description: "Usuário admin",
                status: true
            });
            rolesIds = [role.id];
        } finally {
            if (!createAdminDto.user.password) {
                createAdminDto.user.password = PasswordGenerator.generate(5);
            }

            await this.existsByCpf(createAdminDto.cpf);

            await this.userService.existsByEmail(createAdminDto.user.email);

            const user = await this.userService.create(createAdminDto.user);

            await this.userService.addRolesToUser(user.id, rolesIds);

            const data = {
                userId: user.id,
                cpf: createAdminDto.cpf
                
            }

            const admin = await this.prismaService.administrador.create({ 
                data:data,
                include:{
                    user:true
                } 
            });

            if (!admin) {
                throw new InternalServerErrorException("Ocorreu um erro ao cadastrar administrador.");
            }

            this.emailService.sendEmail(user.email, "Conta criada com sucesso",
                `Conta criada com sucesso! Sua senha para login é ${createAdminDto.user.password}. 
                Para trocar de senha, faça login na plataforma, vá em perfil e troque sua senha!`);

            return admin;

        }
    }

    async findAll(): Promise<Admin[]> {
        return await this.prismaService.administrador.findMany({
            include: {
                user: true
            }
        })
    }

    async findById(id: number): Promise<Admin> {
        const admin = await this.prismaService.administrador.findUnique({
            where: { id },
            include: {
                user: true
            }
        });

        if (!admin) {
            throw new NotFoundException(`Administrador de id ${id} não encontrado`);
        }

        return admin;
    }

    async update(id: number, updateAdminDto: UpdateAdminDto): Promise<Admin> {
        const admin = (await this.findById(id));
        const userId = admin.user.id;

        if(updateAdminDto.cpf !== admin.cpf){
            await this.existsByCpf(updateAdminDto.cpf);
        }

        if(updateAdminDto.user.email !== admin.user.email){
            await this.userService.existsByEmail(updateAdminDto.user.email);
        }
        
        await this.userService.update(userId, updateAdminDto.user);

        const data = {
            id: id,
            userId: userId,
            cpf: updateAdminDto.cpf
        }

        return await this.prismaService.administrador.update({
            where: { id },
            data: data,
            include: {
                user: true
            },
        });
    }

    async delete(id) {
        const admin = await this.findById(id);
        await this.prismaService.administrador.delete({
            where: { id }
        });
        await this.userService.delete((admin).user.id);
    }

    async disable(id) {
        const admin = await this.findById(id);
        const userId = admin.user.id;
        admin.user.status = false;
        await this.prismaService.user.update({
            where: { id },
            data: admin.user.status
        });
        await this.userService.delete((admin).user.id);
    }

    async existsByCpf(cpf:string){
        const administrador =  await this.prismaService.administrador.findUnique({
            where: {
                cpf:cpf
            }
        });

        if(administrador){
            throw new BadRequestException('Já existe um administrador com o CPF cadastrado.');
        }
    }

}
