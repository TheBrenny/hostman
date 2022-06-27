const Service = (tryRequire("node-windows") || tryRequire("node-mac") || tryRequire("node-linix")).Service;
const path = require("path");

const serviceOps = {
    name: "Hostman",
    description: "A web service to modify your hostfile. github.com/TheBrenny/hostman.",
    script: path.resolve(__dirname, "../hostman.js"),
};

const svc = new Service(serviceOps);

function install() {
    return new Promise((resolve, reject) => {
        svc.on("install", () => svc.start());
        svc.on('alreadyinstalled', () => console.log('This service is already installed.') && reject("alreadyinstalled"));
        svc.on("start", () => console.log("Service started! Go to http://hostman:80") && resolve());
        svc.on("error", (err) => console.error(err) && reject("error"));
        svc.install();
    });
}

function uninstall() {
    return new Promise((resolve, reject) => {
        svc.on("uninstall", () => console.log("Service uninstalled!") && resolve());
        svc.on("error", (err) => console.error(err) && reject("error"));
        svc.uninstall();
    });
}

module.exports = {
    install: install,
    uninstall: uninstall,
    serviceOps: serviceOps,
};

function tryRequire(path) {
    try {
        return require(path);
    } catch(e) {
        return null;
    }
}