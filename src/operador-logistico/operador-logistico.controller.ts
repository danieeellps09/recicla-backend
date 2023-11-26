import { Body, Controller, Delete, Get, HttpException, Param, Post, Put } from '@nestjs/common';
import { OperadorLogisticoService } from './operador-logistico.service';
import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { CreateOperadorDto } from './dto/create-operador.dto';
import { ReturnOperadorDto } from './dto/return-operador.dto';
import { OperadorConversor } from './dto/operador-conversor';
import { UpdateOperadorDto } from './dto/update-operador.dto';

@Controller('api/v1/operador-logistico')
export class OperadorLogisticoController {
    constructor(private readonly operadorService:OperadorLogisticoService){}


    @ApiOperation({summary: 'Cria um novo operador.'})
    @ApiCreatedResponse({ description: 'O operador foi criado com sucesso.', type: ReturnOperadorDto })
    @ApiBody({ type: CreateOperadorDto })
    @Post()
    async create(@Body() operadorDto:CreateOperadorDto):Promise<ReturnOperadorDto>{
        try{
            return OperadorConversor.toReturnOperadorDto(await this.operadorService.create(operadorDto));
        }
        catch(error){
            throw new HttpException(error.message, error.status);
        }
    }

    @ApiOperation({summary: 'Retorna todos os operadores do sistema.'})
    @ApiOkResponse({description: 'operadores encontrados', type: ReturnOperadorDto, isArray:true})
    @Get()
    async findAll():Promise<ReturnOperadorDto[]>{
        try{
            return (await this.operadorService.findAll()).map(OperadorConversor.toReturnOperadorDto);
        }
        catch(error){
            throw new HttpException(error.message, error.status);
        }
    }

    @ApiOperation({summary: 'Procura por um operador a partir do seu identificador'})
    @ApiOkResponse({description: 'operador encontrado.', type: ReturnOperadorDto})
    @Get(':id')
    async findById(@Param('id') id:number):Promise<ReturnOperadorDto>{
        try{
            return OperadorConversor.toReturnOperadorDto(await this.operadorService.findById(id));
        }
        catch(error){
            throw new HttpException(error.message, error.status);
        }
    }

    @ApiOperation({summary: 'Atualiza as informações de um operador'})
    @ApiOkResponse({description: 'Dados do operador atualizados com sucesso', type:ReturnOperadorDto})
    @ApiBody({type: UpdateOperadorDto})
    @Put(':id')
    async update(@Param('id') id:number, @Body() updateOperadorDto: UpdateOperadorDto):Promise<ReturnOperadorDto>{
        try{
            return OperadorConversor.toReturnOperadorDto(await this.operadorService.update(id, updateOperadorDto));
        }
        catch(error){
            throw new HttpException(error.message, error.status);
        }
    }

    @ApiOperation({summary: 'Exclui um operador a partir de seu identificador'})
    @ApiOkResponse({description: 'operador excluído com sucesso.'})
    @Delete(':id')
    async delete(@Param('id') id:number){
        try{
            return await this.operadorService.delete(id);
        }
        catch(error){
            throw new HttpException(error.message, error.status);
        }
    }






}
