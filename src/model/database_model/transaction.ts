import { ParseObjectBase } from '../../parse';
import { Event } from './event';
import { User } from './user';

export enum TransactionStatus {
    WAITING = 0,
    APPROVE = 1,
    DECLINE = 2
}

export class Transaction extends ParseObjectBase {
    constructor() {
        super(Transaction.name);
    }

    get message(): string {
        return this.get('content');
    }

    set message(value: string) {
        this.set('content', value);
    }

    get sender(): User {
        return new User(this.get('sender').toJSON());
    }

    set sender(value: User) {
        this.set('sender', value);
    }

    get receiver(): User {
        return new User(this.get('receiver').toJSON());
    }

    set receiver(value: User) {
        this.set('receiver', value);
    }

    get isTopUp(): boolean {
        return this.get('isTopUp');
    }

    set isTopUp(value: boolean) {
        this.set('isTopUp', value);
    }

    get amount(): number {
        return this.get('amount');
    }

    set amount(value: number) {
        this.set('amount', value);
    }

    get status(): TransactionStatus {
        return this.get('status');
    }

    set status(value: TransactionStatus) {
        this.set('status', value);
    }

    get event(): Event {
        return new Event(this.get('event').toJSON());
    }

    set event(value: Event) {
        this.set('event', value);
    }
}