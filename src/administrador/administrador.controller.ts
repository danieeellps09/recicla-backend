import { Body, Controller, Delete, Get, HttpException, Param, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdministradorService } from './administrador.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { Admin } from './entities/admin.entity';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { ReturnAdminDto } from './dto/return-admin.dto';
import { AdminConversor } from './dto/admin-conversor';
import { isPublic } from 'src/auth/decorators/is-public.decorator';

@ApiTags('Administrador')
@Controller('api/v1/administrador')
@isPublic()
//@ApiBearerAuth()
@ApiTags()
export class AdministradorController {
    constructor(private readonly adminService:AdministradorService){}

    @ApiOperation({summary: 'Cria um novo administrador.'})
    @ApiCreatedResponse({ description: 'O administrador foi criado com sucesso.', type: ReturnAdminDto })
    @ApiBody({ type: CreateAdminDto })
    @Post()
    async create(@Body() adminDto:CreateAdminDto):Promise<ReturnAdminDto>{
        try{
            return AdminConversor.toReturnAdminDto(await this.adminService.create(adminDto));
        }
        catch(error){
            throw new HttpException(error.message, error.status);
        }
    }

    @ApiOperation({summary: 'Retorna todos os administradores do sistema.'})
    @ApiOkResponse({description: 'Administradores encontrados', type: ReturnAdminDto, isArray:true})
    @Get()
    async findAll():Promise<ReturnAdminDto[]>{
        try{
            return (await this.adminService.findAll()).map(AdminConversor.toReturnAdminDto);
        }
        catch(error){
            throw new HttpException(error.message, error.status);
        }
    }

    @ApiOperation({summary: 'Procura por um administrador a partir do seu identificador'})
    @ApiOkResponse({description: 'Administrador encontrado.', type: ReturnAdminDto})
    @Get(':id')
    async findById(@Param('id') id:number):Promise<ReturnAdminDto>{
        try{
            return AdminConversor.toReturnAdminDto(await this.adminService.findById(id));
        }
        catch(error){
            throw new HttpException(error.message, error.status);
        }
    }

    @ApiOperation({summary: 'Atualiza as informações de um administrador'})
    @ApiOkResponse({description: 'Dados do administrador atualizados com sucesso', type:ReturnAdminDto})
    @ApiBody({type: UpdateAdminDto})
    @Put(':id')
    async update(@Param('id') id:number, @Body() updateAdminDto: UpdateAdminDto):Promise<ReturnAdminDto>{
        try{
            return AdminConversor.toReturnAdminDto(await this.adminService.update(id, updateAdminDto));
        }
        catch(error){
            throw new HttpException(error.message, error.status);
        }
    }

    @ApiOperation({summary: 'Exclui um administrador a partir de seu identificador'})
    @ApiOkResponse({description: 'Administrador excluído com sucesso.'})
    @Delete(':id')
    async delete(@Param('id') id:number){
        try{
            return await this.adminService.delete(id);
        }
        catch(error){
            throw new HttpException(error.message, error.status);
        }
    }
}
