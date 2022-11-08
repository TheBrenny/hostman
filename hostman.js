#!/usr/bin/env node
(async () => {
    if(process.argv.includes("post-install")) {
        await require("./install/postinstall");
        process.exit(0);
    } else if(process.argv.includes("build-service")) {
        await require("./install/service").install();
        process.exit(0);
    } else if(process.argv.includes("remove-service")) {
        await require("./install/service").uninstall();
        process.exit(0);
    } else if(process.argv.length > 2) { // if we have a command -- clearly not build or remove!
        console.log("Usage: hostman [post-install|build-service|remove-service]");
        console.log("");
        console.log("Options:");
        console.log("  post-install:   Saves the initial hostman binding to the hosts file.");
        console.log("  build-service:  Builds the service and starts it");
        console.log("  remove-service: Removes the service");
        console.log("");
        console.log("Entering any other commands will cause this help message to appear, and Hostman will not start.");
        console.log("");
        console.log("To change the HOST and PORT that Hostman binds to, edit the hosts file of your machine to the bindings you want, and then set the HOSTMAN_HOST and HOSTMAN_PORT environment variables.");
        process.exit(1);
    } else {
        const http = require("http");
        const router = require("./app/router");
        const logRequest = require("./app/logRequest");
        const redirector = require("./app/redirector");
        const apiRoutes = require("./app/api/routes");
        const publicRoutes = require("./app/public/routes");
        const serverInfo = {
            host: process.env.HOSTMAN_HOST ?? "hostman",
            port: process.env.HOSTMAN_PORT ?? 80
        };

        router.register(redirector);
        router.register(apiRoutes);
        router.register(publicRoutes);

        const server = http.createServer((req, res) => {
            logRequest(req, res);
            (async function () {
                await router(req, res);
                await router[404](req, res);
            })();
        });

        server.listen(serverInfo.port, serverInfo.host, () => {
            if(process.env.NODE_ENV === 'dev' && process.env.GUPLING == 'true') serverInfo.port = 81;
            console.log(`Server is listening at http://${serverInfo.host}:${serverInfo.port}...`);
        });
    }
})();
