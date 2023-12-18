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
        const cleanedCnpj = cnpj.replace(/\D/g, '');

        if (cleanedCnpj.length !== 14) {
            return false;
        }

        const calcCnpj = cleanedCnpj.substring(0, 12);
        const digit1 = this.calculateDigit(calcCnpj, 5);
        const digit2 = this.calculateDigit(calcCnpj + digit1, 6);

        return (
            cleanedCnpj === calcCnpj + digit1.toString() + digit2.toString() ||
            cnpj ===
                `${cleanedCnpj.substring(0, 2)}.${cleanedCnpj.substring(
                    2,
                    5
                )}.${cleanedCnpj.substring(5, 8)}/${cleanedCnpj.substring(
                    8,
                    12
                )}-${cleanedCnpj.substring(12)}`
        );
    }

    private calculateDigit(cnpj: string, base: number): number {
        const sum = cnpj.split('').reduce((acc, value) => {
            const digit = parseInt(value, 10);
            return acc + digit * base--;
        }, 0);

        const remainder = sum % 11;
        return remainder < 2 ? 0 : 11 - remainder;
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

