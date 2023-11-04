import { User } from "@prisma/client";

export class Admin{
    id?:number;
    userId?:number;
    cpf?:string;
    user?:User;
}