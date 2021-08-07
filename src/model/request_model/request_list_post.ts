import { RequestListBase } from './request_list_base';

import { IsNotEmpty, MaxLength } from 'class-validator';

export class RequestListPost extends RequestListBase {
    @IsNotEmpty()
    @MaxLength(5)
    text?: string;
}