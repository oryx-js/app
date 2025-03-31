import validator from 'validator';
import { ValidatorData, ValidationErrors } from '@type/core/system-validator';

export default class Validator {
    private fail: boolean = false;
    private errors: ValidationErrors = {};

    public make(data: Record<string, any>, rules: ValidatorData) {
        this.errors = {};
        this.fail = false;

        for (const rule of rules) {
            const value = data[rule.name];
            const ruleTypes = rule.type.split('|');

            const isRequired = ruleTypes.includes('required');
            const isNullable = ruleTypes.includes('nullable');

            if (
                isNullable &&
                (value === undefined || value === null || value === '')
            ) {
                continue;
            }

            if (
                isRequired &&
                (value === undefined || value === null || value === '')
            ) {
                this.addError(rule.name, `${rule.label} is required`);
                continue;
            }

            for (const type of ruleTypes) {
                if (type === 'required' || type === 'nullable') {
                    continue;
                }

                const [ruleName, param] = type.split(':');
                const message = `${rule.label} is invalid format`;

                if (ruleName === 'matches' && param) {
                    const regex = new RegExp(param, 'u');
                    if (!regex.test(String(value))) {
                        this.addError(rule.name, message);
                    }
                } else if (ruleName === 'same' && param) {
                    if (data[param] !== value) {
                        this.addError(
                            rule.name,
                            `${rule.label} must match ${param}`,
                        );
                    }
                } else if (ruleName in validator) {
                    try {
                        // @ts-ignore
                        const isValid = param ? validator[ruleName]( String(value), ...param.split(','), ) : validator[ruleName](String(value));
                        if (!isValid) {
                            this.addError(rule.name, message);
                        }
                    } catch (error) {
                        this.addError(
                            rule.name,
                            `Validation rule '${ruleName}' failed to execute`,
                        );
                    }
                } else {
                    this.addError(
                        rule.name,
                        `Validation rule '${ruleName}' is not supported`,
                    );
                }
            }
        }

        this.fail = Object.keys(this.errors).length > 0;
    }

    private addError(field: string, message: string) {
        if (!this.errors[field]) {
            this.errors[field] = [];
        }
        this.errors[field].push(message);
    }

    public fails(): boolean {
        return this.fail;
    }

    public passes(): boolean {
        return !this.fail;
    }

    public errorsAll(): ValidationErrors {
        return this.errors;
    }

    public firstError(field: string): string | null {
        return this.errors[field]?.[0] || null;
    }
}
