import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { UserPayload } from './models/UserPayload';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
  constructor(private userService: UserService, private readonly jwtService: JwtService) { }

  login(user: User) {
    const payload: UserPayload = {
      sub: user.id,
      email: user.email,
      name: user.name
    }
    const jwtToken = this.jwtService.sign(payload);
    return {
      access_token: jwtToken
    };

  }


  async validateUser(login: string, password: string) {
    const user = await this.userService.findByLogin(login);

    if (user) {
      const senhaValida = bcrypt.compare(password, user.password)
      if (senhaValida) {
        return {
          ...user,
          password: undefined
        }

      }

    }
    throw new Error('Email ou senha está incorreta')
  }



}
