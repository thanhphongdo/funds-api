import { BaseModel } from '../base_model';
import { IsPositive, IsNotEmpty, IsNumber, MaxLength, IsArray } from 'class-validator';
import { RequestListBase } from './request_list_base';

export class RequestEventById extends BaseModel {
    @IsNotEmpty()
    objectId!: string;
}

export class RequestNewEvent extends BaseModel {
    @IsNotEmpty()
    @MaxLength(500)
    content!: string;

    @IsNotEmpty()
    date!: string;

    @IsNumber()
    @IsPositive()
    amount!: number;

    @IsArray()
    @IsNotEmpty()
    members!: Array<string>;

    @IsArray()
    prePaids!: Array<{
        userId: string;
        amount: number;
        message?: string;
    }>;

    @IsArray()
    sponsors!: Array<{
        userId: string;
        amount: number;
        message?: string;
    }>;
}

export class RequestUpdateEvent extends RequestNewEvent {
    @IsNotEmpty()
    objectId!: string;
}
export class RequestListEvent extends RequestListBase {
    userId?: string;
}