import { ParseObjectBase } from '../../parse';
import { User } from './user';

export class Post extends ParseObjectBase {
    constructor() {
        super(Post.name);
    }

    get message(): string {
        return this.get('message');
    }

    set message(value: string) {
        this.set('message', value);
    }

    get like(): number {
        return this.get('like');
    }

    set like(value: number) {
        this.set('like', value);
    }

    get user(): User {
        return new User(this.get('user').toJSON());
    }

    set user(value: User) {
        this.set('user', value);
    }

    get view(): number {
        return this.get('view');
    }

    set view(value: number) {
        this.set('view', value);
    }
}