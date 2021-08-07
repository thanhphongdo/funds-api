import { ConfigInterface } from './config_interface';

export var Config: ConfigInterface = {
    envName: 'DEV',
    parseServer: {
        appId: 'innofunds.id.dev',
        mountPath: '/parse',
        appName: 'innofunds',
        cloud: '/cloud/main.js',
        databaseURI: 'mongodb+srv://root:root@cluster0.cjzgg.mongodb.net/myFirstDatabase',
        masterKey: 'masterkey',
        port: 1337,
        serverURL: 'http://localhost:1337'
    },
    dashboardUrl: '/-board',
    addDocs: true
}