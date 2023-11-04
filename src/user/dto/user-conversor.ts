import { User } from "../entities/user.entity";
import { ReturnUserDto } from "./return-user.dto";

export class UserConversor{
    static toReturnUserDto(user: User): ReturnUserDto{
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            status: user.status,
        }
    }
}