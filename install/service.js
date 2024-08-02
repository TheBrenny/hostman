import {fileURLToPath} from "url";

const nodeOS = await import("node-windows").then(mod => mod).catch(() => import("node-linux")).then(mode => mod).catch(() => import("node-mac")).then(mod => mod);
const Service = nodeOS.Service;

export const serviceOps = {
    name: "Hostman",
    description: "A web service to modify your hostfile. github.com/TheBrenny/hostman.",
    script: fileURLToPath(new URL(import.meta.url, "../hostman.js")),
};

const svc = new Service(serviceOps);

export function install() {
    return new Promise((resolve, reject) => {
        svc.on("install", () => svc.start());
        svc.on('alreadyinstalled', () => console.log('This service is already installed.') && reject("alreadyinstalled"));
        svc.on("start", () => console.log("Service started! Go to http://hostman:80") && resolve());
        svc.on("error", (err) => console.error(err) && reject("error"));
        svc.install();
    });
}

export function uninstall() {
    return new Promise((resolve, reject) => {
        svc.on("uninstall", () => console.log("Service uninstalled!") && resolve());
        svc.on("error", (err) => console.error(err) && reject("error"));
        svc.uninstall();
    });
}