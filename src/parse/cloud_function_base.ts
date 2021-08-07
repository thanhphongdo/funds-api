// import * as Parse from 'parse-server/node';
import { validate } from 'class-validator';
export interface LogsDataInterface { }

export interface CloundFunction {
    (params: any, request: Parse.Cloud.FunctionRequest): Promise<any>;
}

export interface CloudFunctionInterface<T> {
    call(params: any, request: Parse.Cloud.FunctionRequest): Promise<T>;
}

export class CloudFunctionBase {
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
                    let obj = new schema();
                    if (params) {
                        Object.keys(params).forEach(key => {
                            obj[key] = params[key];
                        });
                    }
                    let check = await validate(obj);
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

    static validateRequestIsAdminAuth() {
        return (target: any, propertyKey: string, descriptor: any) => {
            let oldFunc = descriptor.value;
            descriptor.value = {
                [propertyKey]: async function () {
                    let result = null;
                    let user = arguments[1].user;
                    if (!user || !user.get('isAdmin')) {
                        result = await target.throwAdminAuth.apply(this, arguments);
                    } else {
                        result = await oldFunc.apply(this, arguments);
                    }
                    return result;
                }
            }[propertyKey];
        }
    }

    static validateRequestIsNotAdminAuth() {
        return (target: any, propertyKey: string, descriptor: any) => {
            let oldFunc = descriptor.value;
            descriptor.value = {
                [propertyKey]: async function () {
                    let result = null;
                    let user = arguments[1].user;
                    if (!user || user.get('isAdmin')) {
                        result = await target.throwIsAdminAuth.apply(this, arguments);
                    } else {
                        result = await oldFunc.apply(this, arguments);
                    }
                    return result;
                }
            }[propertyKey];
        }
    }

    async defineCloud(cloudFunction: CloundFunction) {
        Parse.Cloud.define(cloudFunction.name, async (req: Parse.Cloud.FunctionRequest) => {
            try {
                return await cloudFunction.call(this, req.params, req);
            } catch (err) {
                throw CloudFunctionBase.error(err);
            }
        });
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

    async throwAdminAuth(params: any, request: Parse.Cloud.FunctionRequest): Promise<any> {
        return new Promise((resolve, reject) => {
            throw new Parse.Error(Parse.Error.INVALID_SESSION_TOKEN, 'You are not Admin. This API is only support for Admin');
        });
    }

    async throwIsAdminAuth(params: any, request: Parse.Cloud.FunctionRequest): Promise<any> {
        return new Promise((resolve, reject) => {
            throw new Parse.Error(Parse.Error.INVALID_SESSION_TOKEN, 'You are Admin. This API is only support for Normal User');
        });
    }

    throwObjectNotFound(): Parse.Error {
        return new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, 'Object is not found');
    }
}