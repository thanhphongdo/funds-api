import { CloudFunctionBase, ParseObjectBase } from '../../parse/index';
import {
    RequestTransferTo,
    RequestApproveOrDeclineTopUp,
    RequestTransactionDetail,
    RequestListTransaction,
    ResponseListBase,
    User,
    Transaction,
    TransactionStatus
} from '../../model/index';
import { ParseQueryBase } from '../../parse';

export class TransactionFunction extends CloudFunctionBase {
    constructor() {
        super();
        this.defineCloud(this._transferTo);
        this.defineCloud(this._topUpByNormalUser);
        this.defineCloud(this._approveOrDeclineTopUp);
        this.defineCloud(this._topUpByAdmin);
        this.defineCloud(this._getTransactionDetail);
        this.defineCloud(this._getTransactionListByUser);
        this.defineCloud(this._getTransactionList);
        this.defineCloud(this._getCurrentUserTransactionList);
    }

    /***
     * Only Normal User Required
     */
    @CloudFunctionBase.validateRequestAuth()
    @CloudFunctionBase.validateRequestIsNotAdminAuth()
    @CloudFunctionBase.validateRequestParam(RequestTransferTo)
    async _transferTo(params: RequestTransferTo, request: Parse.Cloud.FunctionRequest): Promise<{
        transaction: Transaction;
        sender: User;
        receiver: User;
    }> {
        let sender = new User(request.user?.toJSON());
        if (sender.id === params.receiverId) throw new Parse.Error(Parse.Error.VALIDATION_ERROR, 'Receiver is You');
        let receiver = new User({
            objectId: params.receiverId
        });
        let transaction = new Transaction();
        transaction.sender = sender;
        transaction.receiver = receiver;
        transaction.amount = params.amount;
        transaction.message = params.message;
        sender.decrement('balance', params.amount);
        receiver.increment('balance', params.amount);
        receiver = await receiver.save(null, { useMasterKey: true });
        sender = await sender.save(null, { useMasterKey: true });
        transaction = await transaction.saveAsync(null, { useMasterKey: true });
        return {
            transaction,
            sender,
            receiver
        };
    }

    /***
     * <span style="color:red">***Only Normal User Required***</span>
     */
    @CloudFunctionBase.validateRequestAuth()
    @CloudFunctionBase.validateRequestIsNotAdminAuth()
    @CloudFunctionBase.validateRequestParam(RequestTransferTo)
    async _topUpByNormalUser(params: RequestTransferTo, request: Parse.Cloud.FunctionRequest): Promise<Transaction> {
        const sender = new User(request.user?.toJSON());
        let transaction = new Transaction();
        transaction.sender = sender;
        transaction.amount = params.amount;
        transaction.message = `Top up by ${sender.firstName} ${sender.lastName}`;
        transaction.isTopUp = true;
        transaction.status = TransactionStatus.WAITING;
        return await transaction.saveAsync<Transaction>(null, { useMasterKey: true });
    }

    /***
     * <span style="color:red">***Admin Required***</span>
     */
    @CloudFunctionBase.validateRequestAuth()
    @CloudFunctionBase.validateRequestIsAdminAuth()
    @CloudFunctionBase.validateRequestParam(RequestApproveOrDeclineTopUp)
    async _approveOrDeclineTopUp(params: RequestApproveOrDeclineTopUp, request: Parse.Cloud.FunctionRequest): Promise<Transaction> {
        const transaction = await new ParseQueryBase(Transaction).equalTo('objectId', params.transactionId).include('sender').firstAsync<Transaction>({ useMasterKey: true });
        if (!transaction) throw this.throwObjectNotFound();
        if (params.status === TransactionStatus.APPROVE) {
            const sender = transaction.sender;
            sender.increment('balance', transaction.amount);
            await sender.save(null, { useMasterKey: true });
        }
        transaction.status = params.status;
        return await transaction.save(null, { useMasterKey: true });
    }

    /***
     * <span style="color:red">***Admin Required***</span>
     */
    @CloudFunctionBase.validateRequestAuth()
    @CloudFunctionBase.validateRequestIsAdminAuth()
    @CloudFunctionBase.validateRequestParam(RequestTransferTo)
    async _topUpByAdmin(params: RequestTransferTo, request: Parse.Cloud.FunctionRequest): Promise<{
        transaction: Transaction,
        receiver: User
    }> {
        const receiver = await new ParseQueryBase(User).equalTo('objectId', params.receiverId).firstAsync<User>({ useMasterKey: true });
        if (!receiver) throw this.throwObjectNotFound();
        let transaction = new Transaction();
        transaction.receiver = receiver;
        transaction.amount = params.amount;
        transaction.message = `Top up by Admin - for ${receiver.firstName} ${receiver.lastName}`;
        transaction.isTopUp = true;
        transaction.status = TransactionStatus.APPROVE;
        receiver.increment('balance', params.amount);
        return {
            receiver: await receiver.save(null, { useMasterKey: true }),
            transaction: await transaction.saveAsync<Transaction>(null, { useMasterKey: true })
        }
    }

    @CloudFunctionBase.validateRequestAuth()
    @CloudFunctionBase.validateRequestParam(RequestTransactionDetail)
    async _getTransactionDetail(params: RequestTransactionDetail, request: Parse.Cloud.FunctionRequest): Promise<Transaction> {
        const transaction = await new ParseQueryBase(Transaction).equalTo('objectId', params.transactionId).include('sender').firstAsync<Transaction>({ useMasterKey: true });
        if (!transaction) throw this.throwObjectNotFound();
        return transaction;
    }

    @CloudFunctionBase.validateRequestAuth()
    @CloudFunctionBase.validateRequestParam(RequestListTransaction)
    async _getTransactionListByUser(params: RequestListTransaction, request: Parse.Cloud.FunctionRequest): Promise<ResponseListBase<Transaction>> {
        if (!request?.user?.get('isAdmin')) {
            const requestUserId = request?.user?.id;
            if (params.userId != requestUserId) {
                throw new Parse.Error(Parse.Error.VALIDATION_ERROR, 'You cannot get other user\'s transactions');
            }
        }
        const senderQuery = new ParseQueryBase(User).equalTo('objectId', params.userId);
        const receiverQuery = new ParseQueryBase(User).equalTo('objectId', params.userId);
        const userQuery = Parse.Query.or(senderQuery, receiverQuery);
        const transactionBySenderQuery = new ParseQueryBase(Transaction).matchesQuery('sender', userQuery);
        const transactionByReceiverQuery = new ParseQueryBase(Transaction).matchesQuery('receiver', userQuery);
        const transactionQuery = Parse.Query.or(transactionBySenderQuery, transactionByReceiverQuery);
        transactionQuery
            .include('sender')
            .include('receiver')
            .limit(params.perPage)
            .skip(params.perPage * (params.page - 1));
        ParseQueryBase.setOrder(params.order, transactionQuery);
        const [totalRow, transacrions] = await Promise.all([
            transactionQuery.count({ useMasterKey: true }),
            transactionQuery.find({ useMasterKey: true })
        ]);
        return new ResponseListBase<Transaction>(params.page, params.perPage, totalRow, transacrions as any);
    }

    @CloudFunctionBase.validateRequestAuth()
    @CloudFunctionBase.validateRequestParam(RequestListTransaction)
    async _getTransactionList(params: RequestListTransaction, request: Parse.Cloud.FunctionRequest): Promise<ResponseListBase<Transaction>> {
        const transactionQuery = new ParseQueryBase(Transaction);
        transactionQuery
            .include('sender')
            .include('receiver')
            .limit(params.perPage)
            .skip(params.perPage * (params.page - 1));
        ParseQueryBase.setOrder(params.order, transactionQuery);
        const [totalRow, transacrions] = await Promise.all([
            transactionQuery.count({ useMasterKey: true }),
            transactionQuery.findAsync<Transaction>({ useMasterKey: true })
        ]);
        return new ResponseListBase<Transaction>(params.page, params.perPage, totalRow, transacrions);
    }

    @CloudFunctionBase.validateRequestAuth()
    @CloudFunctionBase.validateRequestParam(RequestListTransaction)
    async _getCurrentUserTransactionList(params: RequestListTransaction, request: Parse.Cloud.FunctionRequest): Promise<ResponseListBase<Transaction>> {
        const transactionBySenderQuery = new ParseQueryBase(Transaction).equalTo('sender', request.user);
        const transactionByReceiverQuery = new ParseQueryBase(Transaction).equalTo('receiver', request.user);
        const transactionQuery = Parse.Query.or(transactionBySenderQuery, transactionByReceiverQuery);
        transactionQuery
            .include('sender')
            .include('receiver')
            .limit(params.perPage)
            .skip(params.perPage * (params.page - 1));
        ParseQueryBase.setOrder(params.order, transactionQuery);
        const [totalRow, transacrions] = await Promise.all([
            transactionQuery.count({ useMasterKey: true }),
            transactionQuery.find({ useMasterKey: true })
        ]);
        return new ResponseListBase<Transaction>(params.page, params.perPage, totalRow, transacrions as any);
    }
}