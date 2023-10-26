import { Associacao } from 'src/associacoes/entities/associacao.entity';
import { User } from '../../user/entities/user.entity'; // Importa a entidade User


export class Catador{
  id?: number;
  userId?: number;
  associacaoId: number;
  cpf?: string;
  veiculo?: string;
  user?: User;
  associacao?: Associacao;
}
