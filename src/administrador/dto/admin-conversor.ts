import { identity } from "rxjs";
import { Admin } from "../entities/admin.entity";
import { ReturnAdminDto } from "./return-admin.dto";
import { UserConversor } from "src/user/dto/user-conversor";

export class AdminConversor{
    static toReturnAdminDto(admin:Admin):ReturnAdminDto{
        return {
            id:admin.id,
            user: UserConversor.toReturnUserDto(admin.user),
            cpf:admin.cpf
        }
    }
}