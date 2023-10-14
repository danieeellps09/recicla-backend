import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { UserPayload } from './models/UserPayload';
import { JwtService } from '@nestjs/jwt';
import jwt from 'jsonwebtoken'
@Injectable()
export class AuthService {
  constructor(private userService: UserService, private readonly jwtService: JwtService,
    private readonly users: User) { }

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


async generateResetToken(email:string):Promise<string>{

    const user = this.users.find(user => user.email === email);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRATION_TIME,
    });


    return token;
  }
}



}