import 'reflect-metadata';
import dotenv from 'dotenv';
import Logger from '@core/system/logger';

/** packacges init */
dotenv.config();

class Common {
    public static env<T>(key: string, defValue?: T): T {
        return (process.env[key] as T) ?? defValue!;
    }

    public static baseUrl(segment: string = ''): string {
        const baseUrl = this.env('APP_URL', 'http://localhost').replace(
            /\/+$/,
            '',
        );
        const port = this.env('APP_PORT', 3000)
            ? `:${this.env('APP_PORT')}`
            : '';
        return `${baseUrl}${port}${segment ? `/${segment.replace(/^\/+/, '')}` : ''}`;
    }

    public static extractUrl(
        fullUrl: string,
        get: Exclude<keyof URL, 'toJSON'>,
    ) {
        try {
            return new URL(fullUrl)[get];
        } catch {
            return fullUrl;
        }
    }

    public static async handler<T>(
        callback: () => Promise<T>,
        shouldThrow: boolean | ((error: any) => void) = false,
    ): Promise<T> {
        try {
            return await callback();
        } catch (error: any) {
            if (typeof shouldThrow === 'function') {
                shouldThrow(error);
            } else if (shouldThrow) {
                throw error;
            }
            return this.rawJson(false, 500, error, null) as T;
        }
    }

    public static rawJson(
        status: boolean = true,
        code: number = 200,
        message: string = '',
        result: object | any[] | null = {},
        custom: Partial<Record<string, any>> = {},
    ) {
        return { status, code, message, result, ...custom };
    }

    public static async executeSeed<T>({
        entity,
        data,
    }: {
        entity: new () => T;
        data: Partial<T>[];
    }) {
        const { Database } = await import('@core/module/typeorm');
        const repository = Database.getRepository(entity);

        if (!data.length) {
            Logger.warn(`No data provided for ${entity.name}, seeding skipped`);
            return;
        }

        const allColumns = Object.keys(data[0]);

        await repository
            .createQueryBuilder()
            .insert()
            .into(entity)
            .values(data)
            .orUpdate(allColumns, allColumns)
            .execute();

        Logger.info(
            `Seeder for '${entity.name.replace(/(Entity|entity)$/i, '')}' executed successfully. Records were created and existing data was automatically updated.`,
        );
    }
}

export default Common;
