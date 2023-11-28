import { UserConversor } from "src/user/dto/user-conversor";
import { ReturnCatadorDto } from "./return-catador.dto";
import { AssociacaoConversor } from "src/associacoes/dto/associacao-conversor";
import { Catador } from "../entities/catador.entity";

export class CatadorConversor{
    static toReturnCatadorDto(catador:Catador):ReturnCatadorDto{
        return {
            id: catador.id,
            cpf: catador.cpf,
            bairro: catador.bairro,
            endereco: catador.endereco,
            user: UserConversor.toReturnUserDto(catador.user),
            associacao: AssociacaoConversor.toReturnAssociacaoDto(catador.associacao),
            genero: catador.genero,
            etnia: catador.etnia,
            funcoescatador: catador.funcoescatador
        
        }
    }
}