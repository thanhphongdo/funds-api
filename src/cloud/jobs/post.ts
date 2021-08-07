import { ParseQueryBase, CloudJobBase } from '../../parse';
import { Post } from '../../model/index';

export class PostJob extends CloudJobBase {
    constructor() {
        super();
        this.defineJob('increaseView', this.increaseView);
    }

    async increaseView(request: Parse.Cloud.JobRequest<Parse.Cloud.Params>) {
        const query = new ParseQueryBase(Post);
        const posts = await query.findAllAsync<Post>({
            batchSize: 2
        });
        posts.forEach(post => {
            post.view = post.view + 1;
        });
        Post.saveAll(posts).then(posts => {
            posts.forEach(post => {
                console.log(post.view);
            });
        });
    }
}