import { ConfigInterface } from './config_interface';

export var Config:ConfigInterface = {
    envName: 'PROD',
    parseServer:{
        appId: 'innofunds.id.prod',
        mountPath: '/parse',
        appName: 'innofunds',
        cloud: '/cloud/main.js',
        databaseURI: 'mongodb+srv://root:root@cluster0.cjzgg.mongodb.net/myFirstDatabase',
        masterKey: 'masterkey',
        port: 1337,
        serverURL: 'http://localhost:1337'
    },
    dashboardUser: [
        {
            user: 'root',
            pass: 'r00t'
        }
    ],
    dashboardUrl: '/-board',
    addDocs: false
}