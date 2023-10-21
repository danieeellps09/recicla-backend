import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { isPublic } from 'src/auth/decorators/is-public.decorator';
import { NewMaterial } from './dto/new-material.dto';
import { Material } from './entities/material.entity';
import { MaterialService } from './material.service';
import { UpdateMaterial } from './dto/update-material.dto';
import { Roles } from 'src/role/decorators/role.decorator';
import { UserRole } from 'src/role/enums/roles.enum';
import { RolesGuard } from 'src/role/guards/role.guard';

@ApiTags("Materiais Recicláveis")
@Controller('api/v1/material')
export class MaterialController {
    constructor(private readonly materialService:MaterialService){}

    @ApiOperation({summary: "Cadastra um novo material reciclável."})
    @ApiCreatedResponse({description:'Material adicionado com sucesso'} )
    @ApiBody({type: NewMaterial})
    @ApiBearerAuth()
    @Roles(UserRole.ADMIN)
    @UseGuards(RolesGuard)
    @Post()
    async create(@Body() newMaterial:NewMaterial):Promise<Material>{
        return await this.materialService.create(newMaterial.nome);
    }

    @ApiOperation({summary: "Retorna todos os materiais cadastrados."})
    @ApiOkResponse({description: "Materiais encontrados", type: [UpdateMaterial]})
    @isPublic()
    @Get()
    async findAll():Promise<Material[]>{
        return await this.materialService.findAll();
    }

    @ApiOperation({summary: 'Retorna um material ao buscar por seu identificador'})
    @ApiOkResponse({description:'O material procurado.', type: UpdateMaterial} )
    @isPublic()
    @Get(':id')
    async findById(@Param('id') id:number): Promise<Material>{
        return this.materialService.findById(id);
    }

    @ApiOperation({summary: 'Atualiza o nome do material'})
    @ApiOkResponse({description:'Material atualizado.', type: UpdateMaterial} )
    @ApiBody({type: UpdateMaterial})
    @ApiBearerAuth()
    @Roles(UserRole.ADMIN) 
    @UseGuards(RolesGuard)
    @Put()
    async update(@Body() updateMaterial: UpdateMaterial): Promise<Material>{
        return this.materialService.update(updateMaterial);
    }

    @ApiOperation({summary: 'Exclui um material'})
    @ApiOkResponse({description:'Material atualizado.'})
    @ApiBearerAuth()
    @Roles(UserRole.ADMIN) 
    @UseGuards(RolesGuard)
    @Delete(':id')
    async delete(@Param('id') id:number){
        await this.materialService.delete(id);
    }

}
