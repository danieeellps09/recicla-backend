import { Body, Controller, Get, HttpException, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdministradorService } from './administrador.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { Admin } from './entities/admin.entity';
import { UpdateAdminDto } from './dto/update-admin.dto';

@Controller('api/v1/administrador')
@ApiBearerAuth()
@ApiTags()
export class AdministradorController {
    constructor(private readonly adminService:AdministradorService){}

    @ApiOperation({summary: 'Cria um novo administrador.'})
    @ApiCreatedResponse({ description: 'O administrador foi criado com sucesso.', type: Admin })
    @ApiBody({ type: CreateAdminDto })
    @Post()
    async create(@Body() adminDto:CreateAdminDto):Promise<Admin>{
        try{
            return await this.adminService.create(adminDto);
        }
        catch(error){
            throw new HttpException(error.message, error.status);
        }
    }

    @ApiOperation({summary: 'Retorna todos os administradores do sistema.'})
    @ApiOkResponse({description: 'Administradores encontrados', type: Admin, isArray:true})
    @Get()
    async findAll():Promise<Admin[]>{
        try{
            return await this.adminService.findAll();
        }
        catch(error){
            throw new HttpException(error.message, error.status);
        }
    }

    @ApiOperation({summary: 'Procura por um administrador a partir do seu identificador'})
    @ApiOkResponse({description: 'Administrador encontrado.', type: Admin})
    @Get(':id')
    async findById(@Param('id') id:number):Promise<Admin>{
        try{
            return await this.adminService.findById(id);
        }
        catch(error){
            throw new HttpException(error.message, error.status);
        }
    }

    @ApiOperation({summary: 'Atualiza as informações de um administrador'})
    async update(@Param('id') id:number, @Body() updateAdminDto: UpdateAdminDto):Promise<Admin>{
        try{
            return await this.adminService.update(id, updateAdminDto);
        }
        catch(error){
            throw new HttpException(error.message, error.status);
        }
    }

    @ApiOperation({summary: 'Exclui um administrador a partir de seu identificador'})
    async delete(@Param('id') id:number){
        try{
            return await this.adminService.delete(id);
        }
        catch(error){
            throw new HttpException(error.message, error.status);
        }
    }
}
