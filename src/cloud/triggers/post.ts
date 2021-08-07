import { CloudTriggerBase } from '../../parse/index';

export class PostTrigger extends CloudTriggerBase {
    constructor() {
        super();
        this.defineTriggerAfterSave('Post', this.afterSavePost);
    }

    async afterSavePost(request: Parse.Cloud.BeforeSaveRequest<Parse.Object<Parse.Attributes>>) {
        if (!request.object.get('view')) {
            request.object.set('view', 1);
            return await request.object.save(null, { useMasterKey: true });
        }
        return Promise.resolve(true);
    }
}