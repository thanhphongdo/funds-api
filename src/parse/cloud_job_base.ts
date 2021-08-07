export interface CloudJobFn {
    (request: Parse.Cloud.JobRequest<Parse.Cloud.Params>): void | Promise<void>;
}

export class CloudJobBase {
    defineJob(jobName: string, jobFn: CloudJobFn) {
        Parse.Cloud.job(jobName, (request) => {
            jobFn.call(this, request);
        });
    }
}