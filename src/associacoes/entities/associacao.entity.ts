import { User } from "src/user/entities/user.entity";

export class Associacao extends User{
    id?:number;
    userId?:number;
    cnpj?:string;
    endereco?: string;
}