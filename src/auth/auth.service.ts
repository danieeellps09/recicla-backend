import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { UserPayload } from './models/UserPayload';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private userService: UserService, private readonly jwtService: JwtService) { }

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

  async validateUser(login: string, password: string) {
    const user = await this.userService.findByLogin(login);
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
}
