import {
    BadRequestException,
    Injectable,
    NestMiddleware,
  } from '@nestjs/common';
  import { NextFunction, Request, Response } from 'express';
  import { validate } from 'class-validator';
  import { LoginDTO } from '../dto/login-user-dto';
import { LoginBody } from '../models/LoginBody';
  
  @Injectable()
  export class LoginValidationMiddleware implements NestMiddleware {
    async use(req: Request, res: Response, next: NextFunction) {
      const body = req.body;
  
      const loginBody = new LoginBody();
      loginBody.login = body.login;
      loginBody.password = body.password;
  
      const validations = await validate(loginBody);
  
      if (validations.length) {
        throw new BadRequestException(
          validations.reduce((acc, curr) => {
            return [...acc, ...Object.values(curr.constraints)];
          }, []),
        );
      }
      next();
    }
  }