import { UserConversor } from "src/user/dto/user-conversor";
import { ReturnAssociacaoDto } from "./return-associacao.dto";

export class AssociacaoConversor{
    static toReturnAssociacaoDto(associacao):ReturnAssociacaoDto{
        return {
            id: associacao.id,
            user: UserConversor.toReturnUserDto(associacao.user),
            cnpj: associacao.cnpj,
            bairro: associacao.bairro,
            endereco: associacao.endereco
        }
    }
}