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

        // Remova caracteres não numéricos do CNPJ
        cnpj = cnpj.replace(/[^\d]/g, '');

        // Valide o tamanho do CNPJ
        if (cnpj.length !== 14) {
            return false;
        }

        // Verifique se todos os dígitos são iguais (CNPJs inválidos)
        if (/^(\d)\1+$/.test(cnpj)) {
            return false;
        }

        // Calcula o primeiro dígito verificador
        let sum = 0;
        for (let i = 0; i < 12; i++) {
            sum += parseInt(cnpj[i]) * (5 - (i % 4));
        }
        let digit = 11 - (sum % 11);
        if (digit > 9) {
            digit = 0;
        }
        if (parseInt(cnpj[12]) !== digit) {
            return false;
        }

        // Calcula o segundo dígito verificador
        sum = 0;
        for (let i = 0; i < 13; i++) {
            sum += parseInt(cnpj[i]) * (6 - (i % 4));
        }
        digit = 11 - (sum % 11);
        if (digit > 9) {
            digit = 0;
        }
        return parseInt(cnpj[13]) === digit;
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
