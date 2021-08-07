import { OrderByInterface } from '../model';
import { ParseObjectBase } from '../parse/parse_object_base';
export class ParseQueryBase extends Parse.Query {
    objClass: any;
    constructor(objClass: any) {
        super(objClass.name);
        this.objClass = objClass
    }

    async findAsync<T>(options?: Parse.Query.FindOptions): Promise<Array<T>> {
        return ParseObjectBase.newArrayObject(await super.find(options), this.objClass);
    }

    async findAllAsync<T>(options?: Parse.Query.BatchOptions): Promise<Array<T>> {
        return ParseObjectBase.newArrayObject(await super.findAll(options), this.objClass);
    }

    async firstAsync<T>(options?: Parse.Query.FindOptions): Promise<T | undefined> {
        const data = await super.first(options);
        if (data) {
            return ParseObjectBase.newObject(data, this.objClass);
        }
        return Promise.resolve(undefined);
    }

    async getAsync<T>(objectId: string, options?: Parse.Query.FindOptions): Promise<T> {
        return ParseObjectBase.newObject(await super.get(objectId, options), this.objClass);
    }

    static setOrder(order: Array<OrderByInterface>, queries: Parse.Query) {
        if (order && order.length) {
            order.forEach(item => {
                if (item.asc) {
                    queries.ascending(item.field);
                } else {
                    queries.descending(item.field);
                }
            });
        }
    }
}