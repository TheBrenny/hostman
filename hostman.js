#!/usr/bin/env node

const http = require("http");
const router =  require("./app/router");
const routes = require("./app/routes");
const logRequest = require("./app/logRequest");
const serverInfo = {
    host: "hostman",
    port: 80
};

router.register(routes);

const server = http.createServer((req, res) => {
    logRequest(req, res);
    (async function () {
        await router(req, res);
        await router[404](req, res);
    })();
});

server.listen(serverInfo.port, serverInfo.host, () => {
    if (process.env.NODE_ENV === 'dev' && process.env.GUPLING == 'true') serverInfo.port = 81;
    console.log(`Server is listening at http://${serverInfo.host}:${serverInfo.port}...`);
});