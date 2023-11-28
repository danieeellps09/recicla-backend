import { User } from "@prisma/client";

export class Operador{
    id?:number;
    userId?:number;
    cpf?:string;
    user?:User;
}