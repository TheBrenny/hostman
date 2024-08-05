import {exec as sudo} from "sudo-prompt";
import * as hosts from "hosts-etc";

let hostmanIP = process.env.HOSTMAN_IP || "127.3.3.3";

export async function install1() {
    try {
        console.log("hostman needs administrator privileges to bind http://hostman/ to http://" + hostmanIP + ":80/.");
        console.log("These actions are conducted by npm packages 'hosts-etc' and 'sudo-prompt'.");
        console.log("The code for this process is found in the ./install/install.js script of the hostman package.");
        console.log("");
        console.log("Sleeping for 5 seconds... Press Ctrl+C to cancel.");

        await new Promise((resolve, _) => setTimeout(resolve, 5000));

        let node = process.argv[0];
        let install = url.pathToFileURL(import.meta.filename);

        await new Promise((resolve, _) => {
            sudo(`${node} --import="${install.href}" -e "import('${install.href}').then((mod) => mod.install2())"`, {name: "hostman_installer"},
                (err, stdout, stderr) => {
                    if(err || stderr) throw (err || stderr);
                    else resolve(stdout);
                });
        });
    } catch(e) {
        if(e !== undefined) {
            console.error(e);
            process.exit(e.errno || 1);
        }
    };
}

export async function install2() {
    let host = {
        host: "hostman",
        address: "127.3.3.3",
        region: "hostman",
        comment: "hostman {invincible}"
    };
    hosts.set(host);
}

export async function uninstall1() {
    try {
        console.log("hostman needs administrator privileges to modify the system hosts file.");
        console.log("These actions are conducted by npm packages 'hosts-etc' and 'sudo-prompt'.");
        console.log("The code for this process is found in the ./install/install.js script of the hostman package.");
        console.log("");
        console.log("Sleeping for 5 seconds... Press Ctrl+C to cancel.");

        await new Promise((resolve, _) => setTimeout(resolve, 5000));

        let node = process.argv[0];
        let install = url.pathToFileURL(import.meta.filename);

        await new Promise((resolve, _) => {
            sudo(`${node} --import="${install.href}" -e "import('${install.href}').then((mod) => mod.uninstall2())"`, {name: "hostman_installer"},
                (err, stdout, stderr) => {
                    if(err || stderr) throw (err || stderr);
                    else resolve(stdout);
                });
        });
    } catch(e) {
        if(e !== undefined) {
            console.error(e);
            process.exit(e.errno || 1);
        }
    };
}

export async function uninstall2() {
    hosts.remove("#hostman");
}