import { BaseModel } from '../base_model';
import { IsEmail, IsNotEmpty, IsNumber, IsString, MaxLength, MinLength, MIN_LENGTH } from 'class-validator';

export class RequestUserSignUp extends BaseModel {
    @IsEmail()
    email!: string;

    @IsString()
    @MinLength(6)
    @MaxLength(20)
    username!: string;

    @IsString()
    @MinLength(8)
    @MaxLength(20)
    password!: string;

    @IsNotEmpty()
    firstName!: string;

    @IsNotEmpty()
    lastName!: string;
}

export class RequestUserDetail extends BaseModel {
    @IsNotEmpty()
    userId!: string;
}

export class RequestUserApprove extends BaseModel {
    @IsNotEmpty()
    userId!: string;
}