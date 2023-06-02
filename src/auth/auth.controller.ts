import { Controller, Post, HttpCode, HttpStatus, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthRequest } from './models/AuthRequest';
import { LoginDTO } from 'src/auth/dto/login-user-dto';
import { isPublic } from './decorators/is-public.decorator';
@ApiTags('Auth')
@Controller()
export class AuthController {
    constructor (private readonly authService: AuthService){}

    @Post('/login')
    @HttpCode(HttpStatus.OK)
    @UseGuards(LocalAuthGuard)  
    @isPublic()
    @ApiBody({ type: LoginDTO })
    async login(@Request() req: AuthRequest){
        return await this.authService.login(req.user);
    }




}
