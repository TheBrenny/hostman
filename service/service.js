import {fileURLToPath} from "url";
import {exec as sudo} from "sudo-prompt";
import fs from "fs/promises";

const memoize = {};
const me = new URL(serviceFile("./service.js"));
function serviceFile(path) {
    return memoize[path] ?? (memoize[path] = fileURLToPath(new URL(path, import.meta.url)));
}

export async function install() {
    if(process.platform === "win32") return await installWindows();
    else if(process.platform === "darwin") return await installMac();
    else return await installLinux();
}
export async function uninstall() {
    if(process.platform === "win32") return await uninstallWindows();
    else if(process.platform === "darwin") return await uninstallMac();
    else return await uninstallLinux();
}

export async function installWindows() {
    let node = process.argv[0];
    let script = serviceFile("../hostman.js");

    // Copy/paste the Service executable
    let is64 = process.arch.includes("64");
    if(is64) await fs.copyFile(serviceFile("./hostman64.exe"), serviceFile("./hostman.exe"));
    else await fs.copyFile(serviceFile("./hostman32.exe"), serviceFile("./hostman.exe"));

    // Clone and template the xml
    let xml = (await fs.readFile(serviceFile("./hostman_template.xml"))).toString();
    xml = xml.replace("{{node}}", node).replace("{{args}}", script);
    await fs.writeFile(serviceFile("./hostman.xml"), xml);

    // Run hostman.exe install
    await new Promise((resolve, reject) => {
        let exe = serviceFile("./hostman.exe");
        sudo(`${exe} install && ${exe} start`, {name: "hostman installer"}, (err, stdout, stderr) => {
            if(err || stderr) reject(err || stderr);
            else resolve(stdout);
        });
    });

    return true;
}
export async function uninstallWindows() {
    await new Promise((resolve, reject) => {
        let exe = serviceFile("./hostman.exe");
        sudo(`${exe} stop && ${exe} uninstall`, {name: "hostman installer"}, (err, stdout, stderr) => {
            if(err || stderr) reject(err || stderr);
            else resolve(stdout);
        });
    });

    await Promise.all([fs.rm(serviceFile("./hostman.exe")), fs.rm(serviceFile("./hostman.xml"))])

    return true;
}

export async function installLinux() {
    console.warn("THIS IS EXPERIMENTAL AND UNTESTED!");

    let script = serviceFile("../hostman.js");

    let service = (await fs.readFile(serviceFile("./hostman.linux"))).toString();
    service = service.replace("{{script}}", script);

    await new Promise((resolve, reject) => {
        let serveFile = "/etc/systemd/system/hostman.service";
        sudo(`echo "${service}" > ${serveFile} && systemctl enable hostman && systemctl start hostman`, {name: "hostman installer"}, (err, stdout, stderr) => {
            if(err || stderr) reject(err || stderr);
            else resolve(stdout);
        });
    });

    return true;
}
export async function uninstallLinux() {
    console.warn("THIS IS EXPERIMENTAL AND UNTESTED!");

    await new Promise((resolve, reject) => {
        let serveFile = "/etc/systemd/system/hostman.service";
        sudo(`systemctl stop hostman && rm ${serveFile}`, {name: "hostman installer"}, (err, stdout, stderr) => {
            if(err || stderr) reject(err || stderr);
            else resolve(stdout);
        });
    });
    return true;
}

export async function installMac() {
    console.error("I have no idea how to do this.");
    return false;
}
export async function uninstallMac() {
    console.error("I have no idea how to do this.");
    return false;
}