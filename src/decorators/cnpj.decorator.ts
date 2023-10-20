// cnpj.decorator.ts
import {
    registerDecorator,
    ValidationArguments,
    ValidationDecoratorOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationOptions,
} from 'class-validator';

@ValidatorConstraint({ name: 'isCnpjValid', async: false })
export class IsCnpjValidConstraint implements ValidatorConstraintInterface {
    validate(cnpj: string, args: ValidationArguments) {
        if (!cnpj) {
            return false;
        }

        // Remove characters that are not digits
        cnpj = cnpj.replace(/\D/g, '');

        // Check if the CNPJ has 14 digits
        if (cnpj.length !== 14) {
            return false;
        }

        // Check for known invalid CNPJs
        if (
            cnpj === '00000000000000' ||
            cnpj === '11111111111111' ||
            cnpj === '22222222222222' ||
            cnpj === '33333333333333' ||
            cnpj === '44444444444444' ||
            cnpj === '55555555555555' ||
            cnpj === '66666666666666' ||
            cnpj === '77777777777777' ||
            cnpj === '88888888888888' ||
            cnpj === '99999999999999'
        ) {
            return false;
        }

        // Validate the first digit
        let sum = 0;
        let weight = 5;
        for (let i = 0; i < 12; i++) {
            sum += parseInt(cnpj.charAt(i)) * weight;
            weight--;
            if (weight < 2) {
                weight = 9;
            }
        }

        let remainder = sum % 11;
        let digit1 = remainder < 2 ? 0 : 11 - remainder;

        if (parseInt(cnpj.charAt(12)) !== digit1) {
            return false;
        }

        // Validate the second digit
        sum = 0;
        weight = 6;
        for (let i = 0; i < 13; i++) {
            sum += parseInt(cnpj.charAt(i)) * weight;
            weight--;
            if (weight < 2) {
                weight = 9;
            }
        }

        remainder = sum % 11;
        let digit2 = remainder < 2 ? 0 : 11 - remainder;

        return parseInt(cnpj.charAt(13)) === digit2;
    }
}

export function IsCnpjValid(validationOptions?: ValidationOptions) {
    return function (object: Record<string, any>, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsCnpjValidConstraint,
        });
    };
}
