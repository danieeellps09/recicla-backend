import { User } from '../../user/entities/user.entity'; // Importa a entidade User


export class Catador extends User {
  id?: number;
  userId?: number;
  associacaoId: number;
  cpf?: string;
  veiculo?: string;
}
