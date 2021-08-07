import { CloudBase } from './cloud_base';

export interface CloudTriggerBeforeSave {
    (request: Parse.Cloud.BeforeSaveRequest<Parse.Object<Parse.Attributes>>): Promise<any>;
}

export interface CloudTriggerAfterSave {
    (request: Parse.Cloud.AfterSaveRequest<Parse.Object<Parse.Attributes>>): Promise<any>;
}

export interface CloudTriggerBeforeDelete {
    (request: Parse.Cloud.BeforeDeleteRequest<Parse.Object<Parse.Attributes>>): Promise<any>;
}

export interface CloudTriggerAfterDelete {
    (request: Parse.Cloud.AfterDeleteRequest<Parse.Object<Parse.Attributes>>): Promise<any>;
}

export class CloudTriggerBase extends CloudBase {
    async defineTriggerBeforeSave(objectName: string, cloudTriggerBeforeSave: CloudTriggerBeforeSave) {
        Parse.Cloud.beforeSave(objectName, async (request) => {
            await cloudTriggerBeforeSave.call(this, request);
        });
    }

    async defineTriggerAfterSave(objectName: string, cloudTriggerAfterSave: CloudTriggerAfterSave) {
        Parse.Cloud.afterSave(objectName, async (request) => {
            await cloudTriggerAfterSave.call(this, request);
        });
    }

    async defineTriggerBeforeDelete(objectName: string, cloudTriggerBeforeDelete: CloudTriggerBeforeDelete) {
        Parse.Cloud.beforeDelete(objectName, async (request) => {
            await cloudTriggerBeforeDelete.call(this, request);
        });
    }

    async defineTriggerAfterDelete(objectName: string, cloudTriggerAfterDelete: CloudTriggerAfterDelete) {
        Parse.Cloud.afterDelete(objectName, async (request) => {
            await cloudTriggerAfterDelete.call(this, request);
        });
    }
}