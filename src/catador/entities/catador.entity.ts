import { Associacao } from 'src/associacoes/entities/associacao.entity';
import { User } from '../../user/entities/user.entity';
import { Etnia } from '../etnia/etnia.entity';
import { Genero } from '../genero/genero.entity';


export class Catador{
  id?: number;
  userId?: number;
  associacaoId: number;
  etniaId: number;
  generoId: number;
  cpf?: string;
  bairro?: string;
  endereco:string;
  user?: User;
  associacao?: Associacao;
  etnia?: Etnia;
  genero?: Genero;
}
