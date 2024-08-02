#!/usr/bin/env node

(async () => {
    if(process.argv.length > 2) {
        if(process.argv[2] === "postinstall") await import("./install/postinstall");
        else if(process.argv[2] === "service" && process.argv.length > 3) {
            if(process.argv[3] === "install") (await import("./install/service")).install();
            else if(process.argv[3] === "uninstall") (await import("./install/service")).uninstall();
            else printUsage(1);
        } else printUsage(1);
    } else {
        // https://kit.svelte.dev/docs/adapter-node#environment-variables-origin-protocolheader-hostheader-and-port-header
        // I don't like it, but it's gotta be done this way...
        process.env["HOST"] = process.env["HOST"] ?? process.env["HOSTMAN_HOST"] ?? "hostman";
        process.env["PORT"] = process.env["PORT"] ?? process.env["HOSTMAN_PORT"] ?? "80";
        process.env["PROTO"] = process.env["PROTO"] ?? "http";
        process.env["ORIGIN"] = process.env["ORIGIN"] ?? (`${process.env["PROTO"]}://${process.env["HOST"]}:${process.env["PORT"]}`);

        await import("./build/index.js");
    }
})();

function printUsage(exitCode = 0) {
    console.log("Usage: hostman [post-install|build-service|remove-service]");
    console.log("");
    console.log("Options:");
    console.log("  hostman postinstall:      Saves the initial hostman binding to the hosts file as either the HOSTMAN_IP environment variable, or 127.3.3.3.");
    console.log("  hostman service install:  Builds the service and starts it");
    console.log("  hostman service remove:   Removes the service");
    console.log("");
    console.log("Entering any other commands will cause this help message to appear, and Hostman will not start.");
    console.log("");
    console.log("To change the HOST and PORT that Hostman binds to, edit the hosts file of your machine to the bindings you want, and then set the HOSTMAN_HOST and HOSTMAN_PORT environment variables.");
    process.exit(exitCode);
}