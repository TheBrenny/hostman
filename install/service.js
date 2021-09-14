const Service = (tryRequire("node-windows") || tryRequire("node-mac") || tryRequire("node-linix")).Service;
const path = require("path");

const serviceOps = {
    name: "Hostman",
    description: "A web service to modify your hostfile. github.com/TheBrenny/hostman.",
    script: path.resolve(__dirname, "../hostman.js"),
};

const svc = new Service(serviceOps);

function install() {
    svc.on("install", () => svc.start());
    svc.on('alreadyinstalled', () => console.log('This service is already installed.'));
    svc.on("start", () => console.log("Service started! Go to http://hostman:80"));
    svc.install();
}

function uninstall() {
    svc.on("uninstall", () => console.log("Service uninstalled!"));
    svc.uninstall();
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