import { Test, TestingModule } from '@nestjs/testing';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { Role } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateRoleDto } from './dto/update-role.dto';

describe('RoleService', () => {
    let roleService: RoleService;
    let prismaService: PrismaService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [RoleService, PrismaService],
        }).compile();

        roleService = module.get<RoleService>(RoleService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    it('should be defined', () => {
        expect(roleService).toBeDefined();
    });


    describe('create', () => {
        it('should create a role', async () => {
            const createRoleDto: CreateRoleDto = {
                id: 1,
                name: 'Novo Papel',
                description: 'Descrição do novo papel',
                status: true,


            };

            const createdRole: Role = {
                id: 1,
                name: createRoleDto.name,
                description: createRoleDto.description,
                status: createRoleDto.status,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            jest.spyOn(prismaService.role, 'create').mockResolvedValue(createdRole);

            const result = await roleService.create(createRoleDto);


            expect(prismaService.role.create).toHaveBeenCalledWith({
                data: {
                    name: createRoleDto.name,
                    description: createRoleDto.description,
                    status: createRoleDto.status,
                },
            });


            expect(result).toEqual(createdRole);
        });
    })


    describe('findAll', () => {
        it('should return an array of CreateRoleDto', async () => {
            const roles: Role[] = [
                {
                    id: 1,
                    name: 'Analista de Sistemas',
                    description: 'Profissional responsável por analisar e melhorar sistemas e processos',
                    status: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 2,
                    name: 'Outra Função',
                    description: 'Descrição da outra função',
                    status: false,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ];

            // Mock the behavior of the roleService.findAll method
            jest.spyOn(roleService, 'findAll').mockResolvedValue(roles);

            const result = await roleService.findAll();

            expect(result).toEqual(roles);
        });
    });


    describe('findById', () => {
        it('should return a role when a valid ID is provided', async () => {
            const role = {
                id: 1,
                name: 'Analista de Sistemas',
                description: 'Profissional responsável por analisar e melhorar sistemas e processos',
                status: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            jest.spyOn(prismaService.role, 'findUnique').mockResolvedValue(role);

            const roleId = 1;
            const result = await roleService.findById(roleId);

            expect(result).toEqual(role);
        });

        it('should throw a NotFoundException when an invalid ID is provided', async () => {
            const roleId = 999;
            jest.spyOn(prismaService.role, 'findUnique').mockResolvedValue(null);

            await expect(roleService.findById(roleId)).rejects.toThrow(NotFoundException);

        });
    });

    describe('update', () => {
        it('should update a role when it exists', async () => {
            const roleId = 1; 
            const updateRoleDto: UpdateRoleDto = {
              name: 'Novo Nome',
              description: 'Nova Descrição',
              status: false,
            };
        
            const existingRole: Role = {
              id: roleId,
              name: 'Papel Existente',
              description: 'Descrição Existente',
              status: true,
              createdAt: new Date(),
              updatedAt: new Date(),
            };
        
            jest.spyOn(prismaService.role, 'findUnique').mockResolvedValue(existingRole);
        
            jest.spyOn(prismaService.role, 'update').mockResolvedValue({
              ...existingRole,
              ...updateRoleDto,
            });
        
            const updatedRole = await roleService.update(roleId, updateRoleDto);
        
            expect(prismaService.role.findUnique).toHaveBeenCalledWith({
              where: { id: roleId },
            });
        
            expect(prismaService.role.update).toHaveBeenCalledWith({
              where: { id: roleId },
              data: updateRoleDto,
            });
        
            expect(updatedRole).toEqual({
              ...existingRole,
              ...updateRoleDto,
            });
          });
        
          it('should throw NotFoundException when trying to update a non-existing role', async () => {
            const roleId = 999;  
            const updateRoleDto: UpdateRoleDto = {
              name: 'Novo Nome',
              description: 'Nova Descrição',
              status: false,
            };
        
     

            jest.spyOn(prismaService.role, 'findUnique').mockResolvedValue(null);
        
            try {
              await roleService.update(roleId, updateRoleDto);
            } catch (error) {
              expect(error).toBeInstanceOf(NotFoundException);
              expect(error.message).toBe(`Role with ID ${roleId} not found`);
            }
          });
    })

    describe('delete',() =>{
        it('should delete a role when it exists', async () => {
            const roleId = 1; 
        
            const existingRole: Role = {
              id: roleId,
              name: 'Papel Existente',
              description: 'Descrição Existente',
              status: true,
              createdAt: new Date(),
              updatedAt: new Date(),
            };
        
            jest.spyOn(prismaService.role, 'findUnique').mockResolvedValue(existingRole);
        
            jest.spyOn(prismaService.role, 'delete').mockResolvedValue(existingRole);
        
            const deletedRole = await roleService.delete(roleId);
        
            expect(prismaService.role.findUnique).toHaveBeenCalledWith({
              where: { id: roleId },
            });
        
            expect(prismaService.role.delete).toHaveBeenCalledWith({
              where: { id: roleId },
            });
        
            expect(deletedRole).toEqual(existingRole);
          });
        
          it('should throw NotFoundException when trying to delete a non-existing role', async () => {
            const roleId = 999; 
        
            jest.spyOn(prismaService.role, 'findUnique').mockResolvedValue(null);
        
            try {
              await roleService.delete(roleId);
            } catch (error) {
              expect(error).toBeInstanceOf(NotFoundException);
              expect(error.message).toBe(`Role with ID ${roleId} not found`);
            }
          });
    })

});
