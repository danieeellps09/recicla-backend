import { Controller, Post, Body, Get, Param, NotFoundException, Put, Delete } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiCreatedResponse, ApiBody, ApiOkResponse, ApiBearerAuth } from "@nestjs/swagger";
import { Role } from "@prisma/client";
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
    create(@Body() createRoleDto: CreateRoleDto) {
        return this.roleService.create(createRoleDto);
    }

    @ApiOperation({ summary: 'Retorna uma lista de todos as funçãos cadastradas.' })
    @ApiOkResponse({ description: 'A lista de funções.', type: [CreateRoleDto] })
    @Get()
    async findAll(): Promise<Role[]> {
        return this.roleService.findAll();
    }

    @ApiOperation({ summary: 'Retorna uma função pelo seu ID.' })
    @ApiOkResponse({ description: 'A função encontrado.', type: CreateRoleDto })
    @Get(':id')
    async findById(@Param('id') id: number): Promise<Role> {
        const role = await this.roleService.findById(id);
        if (!role) {
            throw new NotFoundException(`Role with ID ${id} not found`);
        }
        return role;
    }

    @ApiOperation({ summary: 'Atualiza as informações de uma função existente.' })
    @ApiOkResponse({ description: 'As informações da função atualizada.', type: UpdateRoleDto })
    @Put(':id')
    async update(@Param('id') id: number, @Body() updateRoleDto: UpdateRoleDto) {
        return await this.roleService.update(id, updateRoleDto);
    }

    @ApiOperation({ summary: 'Deleta uma função existente.' })
    @ApiOkResponse({ description: 'As informações da função deletada.', type: UpdateRoleDto })
    @Delete(':id')
    async delete(@Param('id') id: number) {
        return await this.roleService.delete(id);
    }
}
