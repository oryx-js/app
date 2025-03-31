import { ObjectLiteral } from 'typeorm';

export interface PaginationParams<T extends ObjectLiteral> {
    page?: number;
    limit?: number;
    filter?: Partial<T>;
    with?: string;
}

export interface PaginationResult<T> {
    limit: number;
    page: number;
    total: number;
    max_page: number;
    data: T[];
}
