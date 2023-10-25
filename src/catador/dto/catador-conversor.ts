import { UserConversor } from "src/user/dto/user-conversor";
import { ReturnCatadorDto } from "./return-catador.dto";

export class CatadorConversor{
    static toReturnCatadorDto(catador):ReturnCatadorDto{
        return {
            id: catador.id,
            cpf: catador.cpf,
            bairro: catador.bairro,
            endereco: catador.endereco,
            user: UserConversor.toReturnUserDto(catador.user),
            associacao: catador.associacao
        }
    }
}