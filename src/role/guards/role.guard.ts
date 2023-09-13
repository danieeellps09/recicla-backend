import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UserRole } from "../enums/roles.enum";
import { User } from "@prisma/client";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const roles = this.reflector.get<string[]>('roles', context.getHandler());

        if (!roles) {
            return true;
        }



        const request = context.switchToHttp().getRequest();
        const user = request.user; 

        if (!user || !user.role) {
            return false;
        }

        

        const hasRole = roles.some(role => user.role.includes(role));
        if (!hasRole) {
            throw new UnauthorizedException("Acesso não autorizado");
        }
        return true;


    }
}
