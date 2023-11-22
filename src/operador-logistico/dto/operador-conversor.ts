import { identity } from "rxjs";
import { Operador } from "../entities/operador.entity";
import { UserConversor } from "src/user/dto/user-conversor";
import { ReturnOperadorDto } from "./return-operador.dto";

export class OperadorConversor{
    static toReturnOperadorDto(operador:Operador):ReturnOperadorDto{
        return {
            id:operador.id,
            user: UserConversor.toReturnUserDto(operador.user),
            cpf:operador.cpf
        }
    }
}