import { BadRequestException, Injectable, NotFoundException, Request } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCatadorDto } from './dto/create-catador.dto';
import { Catador } from './entities/catador.entity';
import { UpdateCatadorDto } from './dto/update-catador.dto';
import { UserService } from 'src/user/user.service';
import { AssociacoesService } from 'src/associacoes/associacoes.service';
import { PasswordGenerator } from 'src/helpers/password-generator';
import { EmailService } from 'src/email/email.service';
import { RoleService } from 'src/role/role.service';
import { EtniaService } from '../etnia/etnia.service';
import { GeneroService } from '../genero/genero.service';
import { Associacao } from 'src/associacoes/entities/associacao.entity';
import { CatadorFormatadoJson } from './models/catador-sem-associacao';
import { FuncoesCatadorService } from 'src/funcoes-catador/funcoes-catador.service';


@Injectable()
export class CatadorService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
    private readonly associacaoService: AssociacoesService,
    private readonly emailService: EmailService,
    private readonly roleService: RoleService,
    private readonly etniaService: EtniaService,
    private readonly generoService:GeneroService,
    private readonly funcaoCatadorService: FuncoesCatadorService) { }

  async create(createCatadorDto: CreateCatadorDto): Promise<Catador> {
    //seta o role como catador
    createCatadorDto.user.roleNames = ["catador"];
    let rolesIds = [];

    try {
      rolesIds = await this.userService.getRoleIdsByName(createCatadorDto.user.roleNames);
    }
    catch (error) {
      const role = await this.roleService.create({
        id: null,
        name: "catador",
        description: "Usuário catador",
        status: true
      });
      rolesIds = [role.id];

    }
    finally {
      //cria uma senha alfanumérica randomica para o novo usuário
      if (!createCatadorDto.user.password) {
        createCatadorDto.user.password = PasswordGenerator.generate(5);
      }

      //Verifica se já existe um catador com o cpf
 if (createCatadorDto.cpf) {
      await this.existsByCpf(createCatadorDto.cpf);
    } else{
      createCatadorDto.cpf = ""
    }
      //Verifica se já existe um user com o email
      await this.userService.existsByEmail(createCatadorDto.user.email);

      //verifica se a associação existe
      await this.associacaoService.findById(createCatadorDto.idAssociacao);

      //verifica se o genero existe
      await this.generoService.findById(createCatadorDto.idGenero);

      //verifica se a etnia existe
      await this.etniaService.findById(createCatadorDto.idEtnia);
      await this.funcaoCatadorService.findOne(createCatadorDto.funcaoId);

      //cria o user
      const user = await this.userService.create(createCatadorDto.user);

      //adiciona as roles
      await this.userService.addRolesToUser(user.id, rolesIds);

      const data = {
        id: createCatadorDto.id,
        userId: user.id,
        cpf: createCatadorDto.cpf,
        bairro: createCatadorDto.bairro,
        endereco: createCatadorDto.endereco,
        associacaoId: createCatadorDto.idAssociacao,
        etniaId: createCatadorDto.idEtnia,
        generoId: createCatadorDto.idGenero,
        funcaoId: createCatadorDto.funcaoId
      };

      //salva o catador
      const catador = await this.prismaService.catador.create({ 
        data: data,
        include: {
          user: true,
          associacao: true,
          etnia:true,
          genero:true,
          funcoescatador:true
        } 
      });

      if (!catador) {
        throw new NotFoundException('Failed to create catador');
      }

      (catador.associacao as Associacao).user = (await this.associacaoService.findById(catador.associacaoId)).user;

      //envia um email para o catador contendo sua senha para login
      //OBS: Mensagem temporária
      this.emailService.sendEmail(user.email, "Conta criada com sucesso",
        `Conta criada com sucesso! Sua senha para login é ${createCatadorDto.user.password}. 
      Para trocar de senha, faça login na plataforma, vá em perfil e troque sua senha!`);

      return catador;
    }

  }

  async findAll(): Promise<Catador[]> {
    let catadores = await this.prismaService.catador.findMany({
      include: {
        user: true,
        associacao: true,
        etnia: true,
        genero:true,
        funcoescatador:true,
      },
    });

    for(let catador of catadores){
      (catador.associacao as Associacao).user = (await this.associacaoService.findById(catador.associacaoId)).user;
    }

    return catadores;
  }



  async findOne(id: number): Promise<Catador>{
    const catador = await this.prismaService.catador.findUnique({
      where: { id },
      include: {
        user: true,
        associacao: true,
        genero: true,
        etnia: true,
        funcoescatador:true
      },
    });

    if (!catador) {
      throw new NotFoundException('Catador not found');
    }

    (catador.associacao as Associacao).user = (await this.associacaoService.findById(catador.associacaoId)).user;

    return catador;
  }


  async  getCatadorByUserID(userId: number) {
    try {
      const catador = await this.prismaService.catador.findFirst({
        where: {
          userId: userId,
        },
      });
      return catador;
    } catch (error) {
      throw new Error('Erro ao obter o Catador do banco de dados');
    }
  }


  async getAssociatedCatadoresByUser(userId: number): Promise<CatadorFormatadoJson[]> {
    const associacao = await this.associacaoService.getAssociacaoByUserID(userId);
    if (!associacao) {
        throw new NotFoundException(`Associação não encontrada para o usuário de id ${userId}`);
    }

    const catadores = await this.prismaService.catador.findMany({
        where: { associacaoId: associacao.id },
        include: {
            user: true,
            genero: true,
            etnia: true,
            funcoescatador:true
        },
    });

    // Mapeia os catadores para omitir a parte do objeto associacao
    const catadoresWithoutAssociacao = catadores.map(catador => ({
        id: catador.id,
        cpf: catador.cpf,
        bairro: catador.bairro,
        endereco: catador.endereco,
        user: catador.user,
        genero: catador.genero,
        etnia: catador.etnia,
        funcao: catador.funcoescatador
        
    }));

    return catadoresWithoutAssociacao;
}


  async update(id: number, updateCatadorDto: UpdateCatadorDto): Promise<Catador> {

    const catador = (await this.findOne(id));
    const userId = catador.userId;

    if(catador.cpf !== updateCatadorDto.cpf)
      //Verifica se já existe um catador com o cpf
      await this.existsByCpf(updateCatadorDto.cpf);

    if(catador.user.email !== updateCatadorDto.user.email)
      //Verifica se já existe um user com o email
      await this.userService.existsByEmail(updateCatadorDto.user.email);
    
    //verifica se a associacao existe
    await this.associacaoService.findById(updateCatadorDto.associacaoId);
    
    //verifica se a etnia existe
    await this.etniaService.findById(updateCatadorDto.idEtnia);
    
    //verifica se o genero existe
    await this.generoService.findById(updateCatadorDto.idGenero)

    //atualiza os dados do usuário
    await this.userService.update(userId, updateCatadorDto.user);

    await  this.funcaoCatadorService.findOne(updateCatadorDto.funcaoId)
    
    const data = {
      id: id,
      userId: updateCatadorDto.user.id,
      cpf: updateCatadorDto.cpf,
      bairro: updateCatadorDto.bairro,
      endereco: updateCatadorDto.endereco,
      associacaoId: updateCatadorDto.associacaoId,
      generoId: updateCatadorDto.idGenero,
      etniaId: updateCatadorDto.idEtnia,
      funcaoId: updateCatadorDto.funcaoId
    };

    //atualiza os dados do catador
    let catadorAtualizado =  await this.prismaService.catador.update({
      where: { id },
      data: data,
      include: {
        user: true,
        associacao: true,
        genero:true,
        etnia:true,
        funcoescatador:true
      },
    });

    (catadorAtualizado.associacao as Associacao).user = (await this.associacaoService.findById(catador.associacaoId)).user;

    return catadorAtualizado;
  }

  async disable(id: number){
    let catador = await this.findOne(id);
    const userId = catador.user.id;
    catador.user.status = false;
    const user = this.prismaService.user.update({
      where: {id},
      data: catador.user.status
    });
    return catador;
  }

  async remove(id: number): Promise<void> {
    const catador = await this.findOne(id);
    await this.prismaService.catador.delete({
      where: { id },
    });

    await this.userService.delete((catador).user.id);
  }

  async existsByCpf(cpf:string){
    const catador = await this.prismaService.catador.findUnique({
      where:{
        cpf:cpf
      }
    })

    if(catador){
      throw new BadRequestException("Já existe um catador com o CPF indicado.");
    }
  }
}
