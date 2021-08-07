import { Object as ParseObject } from 'parse/node';

export class User extends Parse.User {
    constructor(attr: any) {
        super({});
        if (attr) {
            this.setAttr(attr);
        }
    }

    setAttr(data: any) {
        if (data) {
            Object.keys(data).forEach(key => {
                try {
                    this.set(key, data[key]);
                } catch (err) { }
            });
        }
        return this;
    }

    get email(): string | undefined {
        return this.getEmail();
    }

    set email(value: string | undefined) {
        if (value) {
            this.setEmail(value);
        }
    }

    get firstName(): string {
        return this.get('firstName');
    }

    set firstName(value: string) {
        this.set('firstName', value);
    }

    get lastName(): string {
        return this.get('lastName');
    }

    set lastName(value: string) {
        this.set('lastName', value);
    }

    get balance(): number {
        return this.get('balance');
    }

    set balance(value: number) {
        this.set('balance', value);
    }

    get isAdmin(): boolean {
        return this.get('isAdmin');
    }

    set isAdmin(value: boolean) {
        this.set('isAdmin', value);
    }

    get approved(): boolean {
        return this.get('approved');
    }

    set approved(value: boolean) {
        this.set('approved', value);
    }

    static async saveAllAsync(objects: Array<User>, options?: ParseObject.SaveAllOptions): Promise<Array<User>> {
        return (await Parse.Object.saveAll(objects as any, options) as Array<Parse.Object>).map(user => new User(user.toJSON()));
    }
}