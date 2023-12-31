import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
  Get,
  NotFoundException,
  Body,
  UnauthorizedException,
  InternalServerErrorException,
  Param,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthRequest } from './models/AuthRequest';
import { LoginDTO } from 'src/auth/dto/login-user-dto';
import { isPublic } from './decorators/is-public.decorator';
import { CurrentUserLogged } from './decorators/current-users-decorator';
import { User } from 'src/user/entities/user.entity';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ForgotEmailDto } from './dto/forgot-email-dto';
import { ChangePasswordDto } from './dto/change-password-dto';
@ApiTags('Auth')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Faz o login do usuário' })
  @ApiOkResponse({ description: 'login feito com sucesso', type: LoginDTO })
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  @isPublic()
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: LoginDTO })
  async login(@Request() req: AuthRequest) {
    return await this.authService.login(req.user, req);
  }
  
  @Get('/current_user')
  @ApiBearerAuth()
  getUsuarioAtual(@CurrentUserLogged() user: User) {
    return user;
  }



@ApiOperation({ summary: 'Atualiza as informações de um usuário existente.' })
 @ApiOkResponse({ description: 'email encaminhado para redefinição de senha' })
 @isPublic()
@Post('esqueceu-senha')
async forgotPassword(@Body() forgotEmailDto: ForgotEmailDto) {
  const user = await this.authService.findUserByEmail(forgotEmailDto.email);
  if (!user) {
    throw new NotFoundException('E-mail não cadastrado');
  }

  const resetToken = await this.authService.generateResetToken(user);

  await this.authService.sendPasswordResetEmail(user.email, resetToken);

  return { message: 'E-mail de redefinição de senha enviado com sucesso' };
}

@isPublic()
@Post('resetar-senha/:token')
async resetPassword(@Param('token') token: string, @Body() changePasswordDto:ChangePasswordDto ) {
  const isValidToken = await this.authService.validateResetToken(token);

  if (!isValidToken) {
    throw new UnauthorizedException('Token inválido ou expirado');
  }

  const success = await this.authService.resetPassword(token, changePasswordDto.password);

  if (!success) {
    throw new InternalServerErrorException('Falha ao redefinir a senha');
  }

  return { message: 'Senha redefinida com sucesso' };
}


}