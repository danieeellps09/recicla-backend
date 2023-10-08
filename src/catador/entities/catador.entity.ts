import { User } from '../../user/entities/user.entity'; // Importa a entidade User


export class Catador extends User {
  associacaoPertencente: string;
  veiculo: string;
}
