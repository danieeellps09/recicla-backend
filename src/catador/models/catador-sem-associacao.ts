import { Etnia, Genero, User } from "@prisma/client";

export class CatadorFormatadoJson{
    id?: number;
    etniaId?: number;
    generoId?: number;
    cpf?: string;
    bairro?: string;
    endereco:string;
    user?: User;
    etnia?: Etnia;
    genero?: Genero;
  }