// import * as Parse from 'parse-server/node';
export interface LogsDataInterface { }

export class CloudBase {
    static unauthorized = {
        code: Parse.Error.INVALID_SESSION_TOKEN as number,
        message: 'Invalid session token'
    }

    static success(data: any, logsData?: LogsDataInterface) {
        return data;
    }

    static error(data: any, logsData?: LogsDataInterface) {
        return new Parse.Error(data.code || Parse.Error.INTERNAL_SERVER_ERROR, data.message || 'Internal server error');
    }

    static errorValidate(data: any, logsData?: LogsDataInterface) {
        return new Parse.Error(Parse.Error.VALIDATION_ERROR, data);
    }

    static validateRequestParam(schema: any) {
        return (target: any, propertyKey: string, descriptor: any) => {
            let oldFunc = descriptor.value;
            descriptor.value = {
                [propertyKey]: async function () {
                    let result = null;
                    let params = arguments[0];
                    let check = await schema.validate(params);
                    if (check.length) {
                        arguments[0].errorValidate = check;
                        result = await target.throwValidate.apply(this, arguments);
                    } else {
                        result = await oldFunc.apply(this, arguments);
                    }
                    return result;
                }
            }[propertyKey];
        }
    }

    static validateRequestAuth() {
        return (target: any, propertyKey: string, descriptor: any) => {
            let oldFunc = descriptor.value;
            descriptor.value = {
                [propertyKey]: async function () {
                    let result = null;
                    let user = arguments[1].user;
                    if (!user) {
                        result = await target.throwAuth.apply(this, arguments);
                    } else {
                        result = await oldFunc.apply(this, arguments);
                    }
                    return result;
                }
            }[propertyKey];
        }
    }

    async throwValidate(params: any, request: Parse.Cloud.FunctionRequest): Promise<any> {
        return new Promise((resolve, reject) => {
            throw new Parse.Error(Parse.Error.VALIDATION_ERROR, params.errorValidate.map((item: any) => {
                return {
                    property: item.property,
                    value: item.value,
                    constraints: item.constraints
                }
            }));
        });
    }

    async throwAuth(params: any, request: Parse.Cloud.FunctionRequest): Promise<any> {
        return new Promise((resolve, reject) => {
            throw new Parse.Error(Parse.Error.INVALID_SESSION_TOKEN, 'Invalid session token');
        });
    }
}