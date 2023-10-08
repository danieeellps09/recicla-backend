import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthRequest } from "src/auth/models/AuthRequest";
import { PrismaService } from "src/prisma/prisma.service";
import { User } from "src/user/entities/user.entity";
@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private prisma: PrismaService
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const roles = this.reflector.get<string[]>('roles', context.getHandler());
        

        if (!roles) {
            return true;
        }

        const user: User = context.switchToHttp().getRequest().user;
        if (!user || !user.id) {
            return false;
        }
        console.log(user)
        const userId = user.id;

        if (!userId) {
            return false;
        }

        const userRoles = await this.prisma.userRole.findMany({
            where: {
                userId,
            },
            select: {
                role: {
                    select: {
                        name: true,
                    },
                },
            },
        });

        const userRoleNames = userRoles.map((userRole) => userRole.role.name);

   

        const hasRole = roles.some(role => userRoleNames.includes(role));
        if (!hasRole) {
            throw new UnauthorizedException("Acesso não autorizado");
        }
        return true;
    }
}
