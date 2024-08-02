import {exec as sudo} from "sudo-prompt";

let hostmanIP = process.env.HOSTMAN_IP || "127.3.3.3";

export async function step1() {
    try {
        console.log("hostman needs administrator privileges to bind http://hostman/ to http://" + hostmanIP + ":80/.");
        console.log("These actions are conducted by npm packages 'hosts-etc' and 'sudo-prompt'.");
        console.log("The code for this process is found in the postinstall.js script of the hostman package.");
        console.log("");
        console.log("Sleeping for 5 seconds... Press Ctrl+C to cancel.");

        await new Promise((resolve, _) => setTimeout(resolve, 5000));

        let node = process.argv[0];
        let postinstall = url.pathToFileURL(import.meta.filename);

        await new Promise((resolve, _) => {
            params = params.join(", ");
            sudo(`${node} --import="${postinstall.href}" -e "import('${postinstall.href}').then((mod) => mod.step2())"`, {name: "hostman_postinstaller"},
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

export async function step2() {
    const hosts = require("hosts-etc");
    let host = {
        host: "hostman",
        address: "127.3.3.3",
        region: "hostman",
        comment: "hostman {invincible}"
    };
    hosts.set(host);
}