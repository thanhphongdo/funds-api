import { CloudFunctionBase } from '../../parse/index';
import {
    RequestNewEvent,
    ResponseListBase,
    User,
    Event,
    RequestUpdateEvent,
    RequestEventById,
    RequestListEvent,
    Transaction,
    EventStatus
} from '../../model/index';
import { ParseQueryBase } from '../../parse';
import * as _ from 'lodash';

export class EventFunction extends CloudFunctionBase {
    constructor() {
        super();
        this.defineCloud(this._getEventList);
        this.defineCloud(this._getEventByObjectId);
        this.defineCloud(this._newEvent);
        this.defineCloud(this._updateEvent);
        this.defineCloud(this._approveEvent);
        this.defineCloud(this._declineEvent);
    }

    async getUserListByIds(users: Array<String>) {
        return await new ParseQueryBase(User).containedIn('objectId', users).equalTo('approved', true).findAsync<User>({ useMasterKey: true });
    }

    @CloudFunctionBase.validateRequestAuth()
    @CloudFunctionBase.validateRequestParam(RequestListEvent)
    async _getEventList(params: RequestListEvent, request: Parse.Cloud.FunctionRequest): Promise<ResponseListBase<Event>> {
        const eventQuery = new ParseQueryBase(Event);
        eventQuery
            .notEqualTo('status', EventStatus.DECLINE)
            .include('owner')
            .limit(params.perPage)
            .skip(params.perPage * (params.page - 1));
        const [totalRow, events] = await Promise.all([
            eventQuery.notEqualTo('status', EventStatus.DECLINE).count({ useMasterKey: true }),
            eventQuery.findAsync<Event>({ useMasterKey: true })
        ])
        return new ResponseListBase<Event>(params.page, params.perPage, totalRow, events);
    }

    @CloudFunctionBase.validateRequestAuth()
    @CloudFunctionBase.validateRequestParam(RequestEventById)
    async _getEventByObjectId(params: RequestEventById, request: Parse.Cloud.FunctionRequest): Promise<Event> {
        const event = await new ParseQueryBase(Event).equalTo('objectId', params.objectId).firstAsync<Event>({ useMasterKey: true });
        if (!event) throw this.throwObjectNotFound();
        return event;
    }

    @CloudFunctionBase.validateRequestAuth()
    @CloudFunctionBase.validateRequestParam(RequestNewEvent)
    async _newEvent(params: RequestNewEvent, request: Parse.Cloud.FunctionRequest): Promise<Event> {
        const event = new Event();
        event.content = params.content;
        event.date = new Date(params.date);
        event.amount = parseFloat(params.amount + '');
        event.owner = request.user as User;
        event.members = params.members;
        event.prePaids = params.prePaids;
        event.sponsors = params.sponsors;
        event.status = EventStatus.WAITING;
        let userIds: Array<string> = [];
        params.members.forEach(item => userIds.push(item));
        params.prePaids.forEach(item => userIds.push(item.userId));
        params.prePaids.forEach(item => userIds.push(item.userId));
        userIds = _.uniq(userIds);
        const users = await this.getUserListByIds(userIds);
        if (users.length === userIds.length) {
            return await event.saveAsync(null, { useMasterKey: true });
        }
        throw new Parse.Error(Parse.Error.VALIDATION_ERROR, 'Have an user not exist');
    }

    @CloudFunctionBase.validateRequestAuth()
    @CloudFunctionBase.validateRequestParam(RequestUpdateEvent)
    async _updateEvent(params: RequestUpdateEvent, request: Parse.Cloud.FunctionRequest): Promise<Event> {
        const event = await new ParseQueryBase(Event).equalTo('objectId', params.objectId).firstAsync<Event>({ useMasterKey: true });
        if (!event) throw this.throwObjectNotFound();
        event.content = params.content;
        event.amount = params.amount;
        event.owner = request.user as User;
        event.prePaids = params.prePaids;
        event.sponsors = params.sponsors;
        let userIds: Array<string> = [];
        params.members.forEach(item => userIds.push(item));
        params.prePaids.forEach(item => userIds.push(item.userId));
        params.prePaids.forEach(item => userIds.push(item.userId));
        userIds = _.uniq(userIds);
        const users = await this.getUserListByIds(userIds);
        if (users.length === userIds.length) {
            return await event.saveAsync(null, { useMasterKey: true });
        }
        throw new Parse.Error(Parse.Error.VALIDATION_ERROR, 'Have an user not exist');
    }

    @CloudFunctionBase.validateRequestAuth()
    @CloudFunctionBase.validateRequestIsAdminAuth()
    @CloudFunctionBase.validateRequestParam(RequestEventById)
    async _approveEvent(params: RequestEventById, request: Parse.Cloud.FunctionRequest): Promise<{
        event: Event;
        members: Array<User>;
        prePaids: Array<User>;
        sponsors: Array<User>;
        transactions: Array<Transaction>;
    }> {
        const event = await new ParseQueryBase(Event)
            .equalTo('objectId', params.objectId)
            .firstAsync<Event>({ useMasterKey: true });
        if (!event) throw this.throwObjectNotFound();
        if (event.status !== EventStatus.WAITING) throw new Parse.Error(Parse.Error.VALIDATION_ERROR, 'This event is not waiting');
        event.status = EventStatus.APPROVE;
        const eventSaved = await event.saveAsync<Event>(null, { useMasterKey: true });
        const members = event.members || [];
        const sponsors = event.sponsors || [];
        const prePaids = event.prePaids || [];
        const amount = event.amount;
        let amountSponsor = 0;
        let amountPrePaid = 0;
        sponsors.forEach(item => {
            amountSponsor += item.amount;
        });
        prePaids.forEach(item => {
            amountPrePaid += item.amount;
        });
        const amountPerMember = (amount - parseFloat(amountSponsor + '')) / members.length;
        const sponsorAfterSaved = await User.saveAllAsync(sponsors.map(item => {
            return (new User({ objectId: item.userId }).decrement('balance', parseFloat(item.amount + ''))) as User
        }), { useMasterKey: true });
        const prePaidAfterSaved = await User.saveAllAsync(prePaids.map(item => {
            return (new User({ objectId: item.userId }).increment('balance', parseFloat(item.amount + ''))) as User;
        }), { useMasterKey: true });
        const memberAfterSaved = await User.saveAllAsync(members.map(userId => {
            return (new User({ objectId: userId }).decrement('balance', amountPerMember)) as User;
        }), { useMasterKey: true });
        const transactions: Array<Transaction> = [];
        sponsors.forEach(item => {
            let transaction = new Transaction();
            transaction.amount = parseFloat(item.amount + '');
            transaction.message = item.message || '';
            transaction.sender = new User({ objectId: item.userId });
            transaction.receiver = request.user as User;
            transaction.event = event;
            transactions.push(transaction);
        });
        prePaids.forEach(item => {
            let transaction = new Transaction();
            transaction.amount = parseFloat(item.amount + '');
            transaction.message = item.message || '';
            transaction.sender = request.user as User;
            transaction.receiver = new User({ objectId: item.userId });
            transaction.event = event;
            transactions.push(transaction);
        });
        members.forEach(userId => {
            let transaction = new Transaction();
            transaction.amount = amountPerMember;
            transaction.message = `Pay for event ${event.id}`;
            transaction.sender = new User({ objectId: userId });
            transaction.receiver = request.user as User;
            transaction.event = event;
            transactions.push(transaction);
        });
        const transactionAfterSaved = await Transaction.saveAllAsync(transactions, { useMasterKey: true });
        return {
            event: eventSaved,
            members: memberAfterSaved,
            prePaids: prePaidAfterSaved,
            sponsors: sponsorAfterSaved,
            transactions: transactionAfterSaved
        };
    }

    @CloudFunctionBase.validateRequestAuth()
    @CloudFunctionBase.validateRequestIsAdminAuth()
    @CloudFunctionBase.validateRequestParam(RequestEventById)
    async _declineEvent(params: RequestEventById, request: Parse.Cloud.FunctionRequest): Promise<{
        event: Event;
    }> {
        const event = await new ParseQueryBase(Event)
            .equalTo('objectId', params.objectId)
            .firstAsync<Event>({ useMasterKey: true });
        if (!event) throw this.throwObjectNotFound();
        if (event.status !== EventStatus.WAITING) throw new Parse.Error(Parse.Error.VALIDATION_ERROR, 'This event is not waiting');
        event.status = EventStatus.DECLINE;
        const eventSaved = await event.saveAsync<Event>(null, { useMasterKey: true });
        return {
            event: eventSaved
        };
    }

}