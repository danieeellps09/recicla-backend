import { Controller, Post, Body, Get, Param, NotFoundException, Put, Delete, BadRequestException, InternalServerErrorException, ConflictException } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiCreatedResponse, ApiBody, ApiOkResponse, ApiBearerAuth } from "@nestjs/swagger";
import { Prisma, Role } from "@prisma/client";
import { RoleService } from "./role.service";
import { CreateRoleDto } from "./dto/create-role.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { isPublic } from "src/auth/decorators/is-public.decorator";

@ApiTags('Roles')
@isPublic()
@Controller('api/v1/roles')

export class RoleController {

    constructor(private readonly roleService: RoleService) { }

    @ApiOperation({ summary: 'Cria um novo função.' })
    @ApiCreatedResponse({
      description: 'A função foi criada com sucesso.',
      type: CreateRoleDto,
    })
    @ApiBody({ type: CreateRoleDto })
    @Post()
    async create(@Body() createRoleDto: CreateRoleDto): Promise<Role> {
      try {
        if (createRoleDto.name === '') {
            throw new BadRequestException('O nome da função não pode estar vazio.');
          }      
        const role = await this.roleService.create(createRoleDto);
        return role;
      } catch (error) {
       
    
        throw new BadRequestException(error.message);
      }
    }
  
    @ApiOperation({ summary: 'Retorna uma lista de todos as funçãos cadastradas.' })
    @ApiOkResponse({ description: 'A lista de funções.', type: [CreateRoleDto] })
    @Get()
    async findAll(): Promise<Role[]> {
      try {
        const roles = await this.roleService.findAll();
        return roles;
      } catch (error) {
        throw new InternalServerErrorException(error.message);
      }
    }
  
    @ApiOperation({ summary: 'Retorna uma função pelo seu ID.' })
    @ApiOkResponse({ description: 'A função encontrado.', type: CreateRoleDto })
    @Get(':id')
    async findById(@Param('id') id: number): Promise<Role> {
      try {
        const role = await this.roleService.findById(id);
        if (!role) {
          throw new NotFoundException(`Role com ID ${id} não encontrado`);
        }
        return role;
      } catch (error) {

        throw new NotFoundException(error.message);
      }
    }
  
    @ApiOperation({ summary: 'Atualiza as informações de uma função existente.' })
    @ApiOkResponse({ description: 'As informações da função atualizada.', type: UpdateRoleDto })
    @Put(':id')
    async update(@Param('id') id: number, @Body() updateRoleDto: UpdateRoleDto): Promise<Role> {
      try {
        const updatedRole = await this.roleService.update(id, updateRoleDto);
        return updatedRole;
      } catch (error) {
      
        throw new BadRequestException(error.message);
      }
    }
  
    @ApiOperation({ summary: 'Deleta uma função existente.' })
    @ApiOkResponse({ description: 'As informações da função deletada.', type: UpdateRoleDto })
    @Delete(':id')
    async delete(@Param('id') id: number): Promise<Role> {
      try {
        const deletedRole = await this.roleService.delete(id);
        return deletedRole;
      } catch (error) {
        throw new NotFoundException(error.message); 
      }
    }
}
