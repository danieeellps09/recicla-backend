import {  IsString } from 'class-validator';

export class LoginBody {
  @IsString()
  login: string;

  @IsString()
  password: string;
}