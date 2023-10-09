import { User } from '../../user/entities/user.entity'; // Importa a entidade User


export class Catador extends User {
  id?: number;
  userId?: number;
  associacao?: string;
  veiculo?: string;
}
