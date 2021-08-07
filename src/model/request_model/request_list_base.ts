import { IsNumber, IsArray, IsNotEmpty } from 'class-validator';
import { BaseModel } from '../base_model';

export interface OrderByInterface {
    field: string;
    asc?: boolean;
}

export class RequestListBase extends BaseModel {

    @IsNotEmpty()
    @IsNumber()
    page!: number;

    @IsNotEmpty()
    @IsNumber()
    perPage!: number;

    @IsArray()
    order!: Array<OrderByInterface>;
    constructor(page?: number, perPage?: number, order?: Array<OrderByInterface>) {
        super();
        this.page = page || 1;
        this.perPage = perPage || 10;
        this.order = order || [];
    }
}