import { Application } from 'express';
import express = require('express');
const http = require('http');
const ParseServer = require('parse-server').ParseServer;
const ParseDashboard = require('parse-dashboard');
const path = require('path');
import { appConfig } from './config/index';
if (!appConfig.parseServer && appConfig.parseServer) {
    console.log('Config not found');
}
const serverUrl = (appConfig.parseServer.serverURL || '') + appConfig.parseServer.mountPath;
const api = new ParseServer({
    databaseURI: appConfig.parseServer.databaseURI,
    cloud: __dirname + appConfig.parseServer.cloud,
    appId: appConfig.parseServer.appId,
    masterKey: appConfig.parseServer.masterKey,
    serverURL: serverUrl,
    liveQuery: appConfig.parseServer.liveQuery
});

const app: Application = express();

// Serve static assets from the /public folder
if (appConfig.addDocs) {
    app.use('/docs', express.static(path.join(__dirname, '/docs')));
}

app.use(appConfig.parseServer.mountPath || '', api);

if (appConfig.dashboardUrl) {
    const dashboard = new ParseDashboard({
        apps: [{
            serverURL: serverUrl,
            appId: appConfig.parseServer.appId,
            masterKey: appConfig.parseServer.masterKey,
            appName: appConfig.parseServer.appName
        }],
        users: appConfig.dashboardUser
    }, { allowInsecureHTTP: true });
    app.use(appConfig.dashboardUrl, dashboard);
}

// Parse Server plays nicely with the rest of your web routes
app.get('/', function (req, res) {
    res.status(200).send('PARSE NOW!!!');
});

app.use(function (req, res, next) {
    console.log('Time:', Date.now())
    next()
});

const httpServer = http.createServer(app);
httpServer.listen(appConfig.parseServer.port, function () {
    if (appConfig.envName != 'PROD') {
        console.log('===================================');
        console.log('***********************************');
        console.log('===================================');
        console.log(`ENV Name:        ${appConfig.envName}`);
        console.log(`Server port:     ${appConfig.parseServer.port}`);
        console.log(`Server URL:      http://localhost:${appConfig.parseServer.port}`);
        if (appConfig.dashboardUrl) {
            console.log(`Dashboard URL:   http://localhost:${appConfig.parseServer.port}${appConfig.dashboardUrl}`);
        }
        console.log(`MongoDB uri:     ${appConfig.parseServer.databaseURI}`);
        console.log('===================================');
        console.log('***********************************');
        console.log('===================================');
    }
});

// This will enable the Live Query real-time server
if (appConfig.parseServer.liveQuery) {
    ParseServer.createLiveQueryServer(httpServer);
}
