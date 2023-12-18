import { ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, registerDecorator } from "class-validator";
import { IsCnpjValidConstraint } from "./cnpj.decorator";

@ValidatorConstraint({ name: 'isTelefoneValid', async: false })
export class IsTelefoneValidConstraint implements ValidatorConstraintInterface {

    validate(telefone: string, args: ValidationArguments) {
        const regex = /^\(\d{2}\) \d{5}-\d{4}$/;
        return regex.test(telefone);
    }
}

export function IsTelefoneValid(validationOptions?: ValidationOptions) {
    return function (object: Record<string, any>, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsTelefoneValidConstraint,
        });
    };
}