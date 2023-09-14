import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import { ApiBadRequestResponse, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { isPublic } from 'src/auth/decorators/is-public.decorator';
import { Roles } from 'src/role/decorators/role.decorator';
import { UserRole } from 'src/role/enums/roles.enum';
import { RolesGuard } from 'src/role/guards/role.guard';
import { AddRolesDto } from './dto/add-roles-user.dto';



@isPublic()
@ApiTags('Users')
@Controller('api/v1/users')
export class UserController {

  constructor(private readonly userService: UserService) { }

  @ApiOperation({ summary: 'Cria um novo usuário.' })
  @ApiCreatedResponse({
    description: 'O usuário foi criado com sucesso.',
    type: CreateUserDto,
  })
  @ApiBody({ type: CreateUserDto })
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
  
  @ApiOperation({ summary: 'Retorna uma lista de todos os usuários cadastrados.' })
  @ApiOkResponse({ description: 'A lista de usuários.', type: [CreateUserDto] })
  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @ApiOperation({ summary: 'Retorna um usuário pelo seu ID.' })
  @ApiOkResponse({ description: 'O usuário encontrado.', type: CreateUserDto })
  @Get(':id')
  async findById(@Param('id') id: number): Promise<User> {
    const user = await this.userService.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  @ApiOperation({ summary: 'Atualiza as informações de um usuário existente.' })
  @ApiOkResponse({ description: 'As informações do usuário atualizado.', type: CreateUserDto })
  @Put(':id')
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return await this.userService.update(id, updateUserDto);
  }

  @ApiOperation({ summary: 'Deleta um usuário existente.' })
  @ApiOkResponse({ description: 'As informações do usuário deletado.', type: CreateUserDto })
  @Delete(':id')
  @Roles(UserRole.ADMIN) 
  @UseGuards(RolesGuard)
  async delete(@Param('id') id: number) {
    return await this.userService.delete(id);
  }

  @ApiOperation({ summary: 'Associa funções a um usuário existente.' })
  @ApiOkResponse({ description: 'As funções foram associadas com sucesso ao usuário.', type: CreateUserDto })
 
  @Post(':userId/add-roles-by-name')
  async addRolesByName(@Param('userId') userId: number, @Body() body: { roleNames: string[] }) {
    const { roleNames } = body;
    const roleIds = await this.userService.getRoleIdsByName(roleNames);
    
    await this.userService.addRolesToUser(userId, roleIds);

    return 'Funções adicionadas com sucesso ao usuário.';
  }
  
}