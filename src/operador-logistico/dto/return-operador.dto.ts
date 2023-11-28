import { ReturnUserDto } from "src/user/dto/return-user.dto";

export class ReturnOperadorDto{
    id?:number;
    cpf?:string;
    user?:ReturnUserDto;
}