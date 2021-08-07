import { Object } from 'parse/node';
export class ParseObjectBase extends Parse.Object {
    original: any;

    constructor(className?: string, data?: { [key: string]: any }) {
        super(className, data);

    }

    public static newObject<T>(parseObj: Parse.Object, parseClass: any): T {
        let obj: any = new parseClass();
        obj._finishFetch(parseObj.toJSON());
        obj.original = parseObj;
        return obj;
    }

    public static newArrayObject<T>(parseObjs: Array<Parse.Object>, parseClass: any): Array<T> {
        return parseObjs.map(item => ParseObjectBase.newObject(item, parseClass));
    }

    async saveAsync<T>(attrs?: { [key: string]: any } | null, options?: Object.SaveOptions): Promise<T> {
        return await super.save(attrs, options) as any;
    }

    async fetchAsync<T>(options?: Object.FetchOptions): Promise<T> {
        return await super.fetch(options) as any;
    }

    static async saveAllAsync<T>(objects: Array<T>, options?: Object.SaveAllOptions): Promise<Array<T>> {
        return ParseObjectBase.newArrayObject(await Parse.Object.saveAll(objects as any, options) as any, this);
    }
}