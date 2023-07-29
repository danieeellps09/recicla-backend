import { SetMetadata, ExecutionContext } from "@nestjs/common";
import { createParamDecorator } from "@nestjs/common/decorators";

export const IS_PUBLIC_KEY = 'isPublic';
export const isPublic = () => SetMetadata(IS_PUBLIC_KEY, true)

