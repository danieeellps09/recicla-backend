import { ReturnUserDto } from "src/user/dto/return-user.dto";

export class ReturnAdminDto{
    id?:number;
    cpf?:string;
    user?:ReturnUserDto;
}