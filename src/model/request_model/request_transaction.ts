import { BaseModel } from '../base_model';
import { IsEmail, IsNotEmpty, IsNumber, IsPositive, IsString, MaxLength, MinLength, MIN_LENGTH } from 'class-validator';
import { TransactionStatus } from '../database_model/transaction';
import { RequestListBase } from './request_list_base';

export class RequestTransferTo extends BaseModel {

    receiverId!: string;

    @IsNumber()
    @IsPositive()
    amount!: number;

    message!: string;
}

export class RequestApproveOrDeclineTopUp extends BaseModel {

    @IsNotEmpty()
    transactionId!: string;

    @IsNumber()
    status!: TransactionStatus;
}

export class RequestTransactionDetail extends BaseModel {

    @IsNotEmpty()
    transactionId!: string;
}


export class RequestListTransaction extends RequestListBase {
    userId?: string;
}