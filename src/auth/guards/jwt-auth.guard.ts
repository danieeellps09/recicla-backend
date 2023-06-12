// NestJS
import {
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorators/is-public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }

  canActivate(context: ExecutionContext): Promise<boolean> | boolean {
   const request = context.switchToHttp.getRequest<Request>()
   const token = request.cookies['acess_token']
   request.headers = ['authorization'] =`Bearer${token}`
   return super.canActivate(context)
  }
   
}