import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { UserPayload } from './models/UserPayload';
import { JwtService } from '@nestjs/jwt';
import jwt from 'jsonwebtoken'
import * as nodemailer from 'nodemailer';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService, private readonly jwtService: JwtService) { }

  private readonly transporter = nodemailer.createTransport({
    host: 'gmail',
    port: 587,
    secure: false, 
    auth: {
      user: 'danieltricolorlps@gmail.com',
      pass: 'QueDeusPerdoeEssasPessoasRuins*@',
    },
  });
  login(user: User, req) {
    const payload: UserPayload = {
      sub: user.id,
      email: user.email,
      name: user.name
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
  const user = this.userService.findByEmail(users.email)
    const payload = {
      id: (await user).id,
      email: (await user).email
    }
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRATION_TIME,
    });


    return token;
  }



  async sendPasswordResetEmail(email: string, resetToken: string): Promise<void> {


    const resetLink = `http://seu-app.com/resetar-senha/${resetToken}`; 

    try {
      // Enviar e-mail
      await this.transporter.sendMail({
        from: 'danieltricolorlps@gmail.com',
        to: email,
        subject: 'Redefinição de Senha',
        html: `<p>Você solicitou a redefinição de senha. Clique no link a seguir para redefinir sua senha:</p>
               <a href="${resetLink}">${resetLink}</a>`,
      });

      console.log('E-mail de redefinição de senha enviado com sucesso.');
    } catch (error) {
      console.error('Erro ao enviar e-mail de redefinição de senha:', error);
      throw new Error('Erro ao enviar e-mail de redefinição de senha');
    }
  }


}