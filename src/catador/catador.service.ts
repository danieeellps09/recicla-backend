import { Injectable, NotFoundException, Request } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCatadorDto } from './dto/create-catador.dto';
import { Catador } from './entities/catador.entity';
import { UpdateCatadorDto } from './dto/update-catador.dto';
import { UserService } from 'src/user/user.service';
import { AssociacoesService } from 'src/associacoes/associacoes.service';
import { PasswordGenerator } from 'src/helpers/password-generator';
import { EmailService } from 'src/email/email.service';


@Injectable()
export class CatadorService {
  constructor(
    private readonly prismaService: PrismaService, 
    private readonly userService: UserService,
    private readonly associacaoService: AssociacoesService,
    private readonly emailService: EmailService) { }

  async create(createCatadorDto: CreateCatadorDto): Promise<Catador> {
    //seta o role como admin
    createCatadorDto.user.roleNames = ["catador"];

    //cria uma senha alfanumérica randomica para o novo usuário
    if(!createCatadorDto.user.password){
      createCatadorDto.user.password = PasswordGenerator.generate(5);
    }

    //verifica se a associação existe
    await this.associacaoService.findById(createCatadorDto.idAssociacao);
    
    //cria o user
    const user = await this.userService.create(createCatadorDto.user);

    const data = {
      id: createCatadorDto.id,
      userId: user.id,
      cpf: createCatadorDto.cpf,
      bairro: createCatadorDto.bairro,
      endereco: createCatadorDto.endereco,
      associacaoId: createCatadorDto.idAssociacao
    };

    //salva o catador
    const catador = await this.prismaService.catador.create({ data });

    if (!catador) {
      throw new NotFoundException('Failed to create catador');
    }

    //envia um email para o catador contendo sua senha para login
    //OBS: Mensagem temporária
    this.emailService.sendEmail(user.email, "Conta criada com sucesso", 
      `Conta criada com sucesso! Sua senha para login é ${user.password}. 
      Para trocar de senha, faça login na plataforma, vá em perfil e troque sua senha!`);

    return catador;
  }

  async findAll(): Promise<Catador[]> {
    return this.prismaService.catador.findMany({
      include: {
        user: true,
        associacao: true
      },
    });
  }

  async findOne(id: number): Promise<Catador> {
    const catador = await this.prismaService.catador.findUnique({
      where: { id },
      include: {
        user: true,
        associacao: true
      },
    });

    if (!catador) {
      throw new NotFoundException('Catador not found');
    }

    return catador;
  }

  async update(id: number, updateCatadorDto: UpdateCatadorDto): Promise<Catador> {

    //pega o id do user que está relacionado com o catador
    const userId = (await this.findOne(id)).userId;

    //atualiza os dados do usuário
    await this.userService.update(userId, updateCatadorDto.user);

    const data = {
      id: updateCatadorDto.id,
      userId: updateCatadorDto.id,
      cpf: updateCatadorDto.cpf,
      bairro: updateCatadorDto.bairro,
      endereco: updateCatadorDto.endereco,
      associacaoId: updateCatadorDto.associacaoId
    };

    //atualiza os dados do catador
    return this.prismaService.catador.update({
      where: { id },
      data: data,
    });
  }

  async remove(id: number): Promise<void> {
    await this.prismaService.catador.delete({
      where: { id },
    });
  }
}
