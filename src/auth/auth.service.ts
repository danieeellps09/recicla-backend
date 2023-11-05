import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { UserPayload } from './models/UserPayload';
import { JwtService } from '@nestjs/jwt';
const jwt = require('jsonwebtoken');
import * as nodemailer from 'nodemailer';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import { EmailService } from 'src/email/email.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService, private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    private configService: ConfigService

    ) { }

 
  async login(user: User, req) {
    const roleIds = await this.userService
    .getRoleIdsByUserId(user.id);

    const payload: UserPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      roleNames: roleIds
    }
    const jwtToken = this.jwtService.sign(payload);
    req.res.cookie('token', 'Bearer ' + jwtToken, { httpOnly: true });

    return {
      access_token: jwtToken
    };

  }

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (user) {
      const senhaValida = await bcrypt.compare(password, user.password)
      if (senhaValida) {
        return {
          ...user,
          password: undefined
        }
      }
    }
    throw new Error('Login ou senha está incorreta')
  }


  async findUserByEmail(email: string) {
    const userEmail = await this.userService.findByEmail(email);
    if (userEmail) {
      return userEmail;
    }
    throw new Error("Email não encontrado")

  }


async generateResetToken(users:User):Promise<string>{
  const user = await this.userService.findByEmail(users.email)
  

  if (!user) {
    throw new NotFoundException('Usuário não encontrado');
  }

  const payload = {
    id: user.id,
    email: user.email,
  };

    const token = this.jwtService.sign(payload)

    return token;
  }



  async sendPasswordResetEmail(email: string, resetToken: string): Promise<void> {


    const resetLink = `http://seu-app.com/resetar-senha/${resetToken}`; 

    try {
      await this.emailService.sendEmail(email, 'Redefinição de Senha', `<p>Você solicitou a redefinição de senha. Clique <a href="${resetLink}">aqui</a> para redefinir sua senha.</p>`);

      console.log('E-mail de redefinição de senha enviado com sucesso.');
    } catch (error) {
      if (error.message === 'Invalid login') {
        console.error('Erro de autenticação:', error);
        throw new Error('Credenciais de e-mail inválidas');
      } else {
        console.error('Erro ao enviar e-mail de redefinição de senha:', error);
        throw new Error('Erro ao enviar e-mail de redefinição de senha');
      }
    }
  }

  async validateResetToken(token: string): Promise<boolean> {
    try {
      if(!token){
      throw new NotFoundException('Token não encontrado')
      }
      const decodedToken = jwt.verify(token, this.configService.get<string>('jwtSecretKey'));
      return true;
    } catch (error) {
      console.error('Erro ao validar token:', error.message);
      return false;
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<boolean> {
    try {
      const decodedToken = jwt.verify(token, this.configService.get<string>('jwtSecretKey')) as DecodedToken;
      const userId = decodedToken.id;
      let userIndex = await this.userService.findById(userId);
      if (!userIndex) {
        throw new NotFoundException('Usuário não encontrado');
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      const passwordUpdate:UpdateUserDto = {
        id: userId,
        password: hashedPassword,
        status: true,    
      };
  

      await this.userService.update(userId, passwordUpdate);

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }


}