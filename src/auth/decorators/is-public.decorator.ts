import { SetMetadata, ExecutionContext } from "@nestjs/common";
import { createParamDecorator } from "@nestjs/common/decorators";

export const IS_PUBLIC_KEY = 'isPublic';
export const isPublic = () => SetMetadata(IS_PUBLIC_KEY, true)

export const IsPublic = createParamDecorator(data: unknown, context: ExecutionContext){
    const request = context.switchToHttp().getRequest();
    const handler = context.getHandler();
    const isPublic = Reflect.getMetadata(IS_PUBLIC_KEY,handler);

    return isPublic
}
