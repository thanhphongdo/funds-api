import { BaseModel } from '../base_model';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class RequestPost extends BaseModel {
    @IsNotEmpty()
    message?: string;

    @IsNumber()
    like?: number;

    @IsNotEmpty()
    text?: string;
}