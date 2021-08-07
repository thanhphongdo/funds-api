import { CloudFunctionBase } from '../../parse/index';
import { RequestUserSignUp, RequestUserApprove, RequestUserDetail, RequestListBase, ResponseListBase, User } from '../../model/index';
import { ParseQueryBase } from '../../parse';

export class UserFunction extends CloudFunctionBase {
    constructor() {
        super();
        this.defineCloud(this._signUp);
        this.defineCloud(this._userApprove);
        this.defineCloud(this._getUserById);
        this.defineCloud(this._getApprovedUserList);
        this.defineCloud(this._getUnapprovedUserList);
    }

    @CloudFunctionBase.validateRequestParam(RequestUserSignUp)
    async _signUp(params: RequestUserSignUp, request: Parse.Cloud.FunctionRequest): Promise<User> {
        const user = new User({
            email: params.email,
            username: params.username,
            password: params.password,
            firstName: params.firstName,
            lastName: params.lastName,
        });
        return await user.signUp(null, { useMasterKey: true });
    }

    /***
     * <span style="color:red">***Admin Required***</span>
     */
    @CloudFunctionBase.validateRequestAuth()
    @CloudFunctionBase.validateRequestIsAdminAuth()
    @CloudFunctionBase.validateRequestParam(RequestUserApprove)
    async _userApprove(params: RequestUserApprove, request: Parse.Cloud.FunctionRequest): Promise<User> {
        const userQuery = new ParseQueryBase(User);
        userQuery.equalTo('objectId', params.userId);
        const user = await userQuery.firstAsync<User>({ useMasterKey: true });
        if (!user) throw this.throwObjectNotFound();
        user.approved = true;
        return await user.save(null, { useMasterKey: true });
    }

    /***
     * <span style="color:red">***Admin Required***</span>
     */
    @CloudFunctionBase.validateRequestAuth()
    @CloudFunctionBase.validateRequestIsAdminAuth()
    @CloudFunctionBase.validateRequestParam(RequestUserDetail)
    async _getUserById(params: RequestUserDetail, request: Parse.Cloud.FunctionRequest): Promise<User> {
        const user = await new ParseQueryBase(User).equalTo('objectId', params.userId).include('sender').firstAsync<User>({ useMasterKey: true });
        if (!user) throw this.throwObjectNotFound();
        return user;
    }

    @CloudFunctionBase.validateRequestAuth()
    @CloudFunctionBase.validateRequestParam(RequestListBase)
    async _getApprovedUserList(params: RequestListBase, request: Parse.Cloud.FunctionRequest): Promise<ResponseListBase<User>> {
        const userQuery = new ParseQueryBase(User);
        userQuery
            .equalTo('approved', true)
            .limit(params.perPage)
            .skip(params.perPage * (params.page - 1));
        if (!request.user?.get('isAdmin')) {
            userQuery.select('firstName', 'lastName', 'balance', 'approved');
        }
        ParseQueryBase.setOrder(params.order, userQuery);
        const [totalRow, users] = await Promise.all([
            userQuery.equalTo('approved', true).count({ useMasterKey: true }),
            userQuery.findAsync<User>({ useMasterKey: true })
        ]);
        return new ResponseListBase<User>(params.page, params.perPage, totalRow, users);
    }

    @CloudFunctionBase.validateRequestAuth()
    @CloudFunctionBase.validateRequestParam(RequestListBase)
    async _getUnapprovedUserList(params: RequestListBase, request: Parse.Cloud.FunctionRequest): Promise<ResponseListBase<User>> {
        const userQuery = new ParseQueryBase(User);
        const totalRow = await userQuery.notEqualTo('approved', true).count({ useMasterKey: true });
        userQuery
            .notEqualTo('approved', true)
            .limit(params.perPage)
            .skip(params.perPage * (params.page - 1));
        if (!request.user?.get('isAdmin')) {
            userQuery.select('firstName', 'lastName', 'balance', 'approved');
        }
        ParseQueryBase.setOrder(params.order, userQuery);
        return new ResponseListBase<User>(params.page, params.perPage, totalRow, await userQuery.find({ useMasterKey: true }) as any);
    }

}