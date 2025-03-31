export type ValidatorData = {
    name: string;
    label: string;
    type: string;
}[];

export type ValidationErrors = Record<string, string[]>;
