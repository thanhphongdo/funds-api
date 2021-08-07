import { CloudFunctionBase } from '../../parse/index';
import { RequestPost, RequestListPost, ResponseListBase, Post } from '../../model/index';
import { ParseQueryBase } from '../../parse';

export class PostFunction extends CloudFunctionBase {
    constructor() {
        super();
        this.defineCloud(this.addPost);
        this.defineCloud(this.addIncognitoPost);
        this.defineCloud(this.listPost);
    }

    @CloudFunctionBase.validateRequestAuth()
    @CloudFunctionBase.validateRequestParam(RequestPost)
    async addPost(params: RequestPost, request: Parse.Cloud.FunctionRequest): Promise<Post> {
        var post = new Post();
        post.message = params.message as any;
        post.like = params.like as any;
        post.user = request.user as any;
        return await post.saveAsync<Post>(null, { useMasterKey: true });
    }

    @CloudFunctionBase.validateRequestParam(RequestPost)
    async addIncognitoPost(params: RequestPost, request: Parse.Cloud.FunctionRequest): Promise<Post> {
        var post = new Post();
        post.message = params.message as any;
        post.like = params.like as any;
        return await post.saveAsync<Post>(null, { useMasterKey: true });
    }

    @CloudFunctionBase.validateRequestParam(RequestListPost)
    async listPost(params: RequestListPost, request: Parse.Cloud.FunctionRequest): Promise<ResponseListBase<Post>> {
        let postQuery = new ParseQueryBase(Post);
        params.perPage = params.perPage || 10;
        params.page = params.page || 1;
        if (params.perPage > 10000) {
            throw new Parse.Error(400, 'Per Page limit 10000');
        }
        postQuery.limit(params.perPage);
        postQuery.skip(params.perPage * (params.page - 1));
        // postQuery.include('user');
        let data = await postQuery.findAsync<Post>({ useMasterKey: true });
        // let user = data[0].user;
        // let test = Math.ceil(Math.random() * 1000);
        // user.set('test', test);
        // await user.save(null, { useMasterKey: true });
        return new ResponseListBase<Post>(1, 10, 0, data);
    }
}