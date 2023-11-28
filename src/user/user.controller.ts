import { BadRequestException, Body, Controller, Delete, Get, InternalServerErrorException, NotFoundException, Param, Post, Put, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { isPublic } from 'src/auth/decorators/is-public.decorator';
import { Roles } from 'src/role/decorators/role.decorator';
import { UserRole } from 'src/role/enums/roles.enum';
import { RolesGuard } from 'src/role/guards/role.guard';
import { AddRolesDto } from './dto/add-roles-user.dto';
import { Logger } from '@nestjs/common';
import { UserConversor } from './dto/user-conversor';
import { AuthRequest } from 'src/auth/models/AuthRequest';



@ApiTags('Users')
@isPublic()
@Controller('api/v1/users')
export class UserController {

  constructor(private readonly userService: UserService,) { 
    
  }
  private readonly logger = new Logger(UserController.name);
  @ApiOperation({ summary: 'Cria um novo usuário.' })
  @ApiCreatedResponse({
    description: 'O usuário foi criado com sucesso.',
    type: CreateUserDto,
  })
  @ApiBody({ type: CreateUserDto })
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    try {

      if (!createUserDto.roleNames || createUserDto.roleNames.length === 0) {
        throw new BadRequestException("O campo 'roleNames' é obrigatório.");
      }

      const roleIds = await this.userService.getRoleIdsByName(createUserDto.roleNames);

      if (roleIds.length !== createUserDto.roleNames.length) {
        throw new BadRequestException("Uma ou mais roles fornecidas não existem.");
      }

      const user = await this.userService.create(createUserDto);



      await this.userService.addRolesToUser(user.id, roleIds);

      return user;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }


  @ApiOperation({ summary: 'Retorna uma lista de todos os usuários cadastrados.' })
  @ApiOkResponse({ description: 'A lista de usuários.', type: [CreateUserDto] })
  @Get()
  async findAll(): Promise<User[]> {
    try {
      const users = await this.userService.findAll();
      return users;
    } catch (error) {
      
      throw new InternalServerErrorException('Erro ao buscar a lista de usuários.');
    }
  }

  @ApiOperation({ summary: 'Retorna um usuário pelo seu ID.' })
  @ApiOkResponse({ description: 'O usuário encontrado.', type: CreateUserDto })
  @Get(':id')
  async findById(@Param('id') id: number): Promise<User> {
    try {
      const user = await this.userService.findById(id);
      if (!user) {
        throw new NotFoundException(`Usuário com ID ${id} não encontrado.`);
      }
      return user;
    } catch (error) {
      const errorMessage = `Erro ao buscar o usuário: ${error.message}`;

      throw new InternalServerErrorException(errorMessage);
    }
  }

  @ApiOperation({ summary: 'Atualiza as informações de um usuário existente.' })
  @ApiOkResponse({ description: 'As informações do usuário atualizado.', type: CreateUserDto })
  @Put(':id')
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    try {
      const updatedUser = await this.userService.update(id, updateUserDto);

      if (!updatedUser) {
        throw new NotFoundException(`Usuário com ID ${id} não encontrado.`);
      }

      return updatedUser;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error; 
      } else {
        throw new InternalServerErrorException('Erro ao atualizar as informações do usuário.');
      }
    }
  }
    @ApiOperation({ summary: 'Deleta um usuário existente.' })
    @ApiOkResponse({ description: 'As informações do usuário deletado.', type: CreateUserDto })
    @Delete(':id')
    async  delete(@Param('id') id: number) {
      try {
        const deletedUser = await this.userService.delete(id);
        if (!deletedUser) {
          throw new NotFoundException(`Usuário com ID ${id} não encontrado.`);
        }
        return deletedUser;
      } catch (error) {
        if (error instanceof NotFoundException) {
          throw error;
        } else {
          const errorMessage = error.message || 'Erro desconhecido ao deletar o usuário.';
         
          throw new InternalServerErrorException(errorMessage);
        }
      }
    }

    @ApiOperation({ summary: 'Atualiza a senha do usuário logado.' })
    @ApiOkResponse({ description: 'As informações atualizadas do usuário logado.', type: CreateUserDto })
    @Put('update/password')
    async updatePassword(@Req() req: AuthRequest, @Body() updateSenha: UpdateSenha) {
      return UserConversor.toReturnUserDto(await this.userService.changePassword(req.user.id, updateSenha.password));
    }
  
    
    @ApiOperation({ summary: 'Atualiza o email do usuário logado.' })
    @ApiOkResponse({ description: 'As informações atualizadas do usuário logado.', type: CreateUserDto })
    @Put('update/email')
    async updateEmail(@Req() req: AuthRequest, @Body() updateEmail: UpdateEmail) {
      return UserConversor.toReturnUserDto(await this.userService.changeEmail(req.user.id, updateEmail.email));
    }



  }