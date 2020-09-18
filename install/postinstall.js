// This script should write to the hosts file
const sudo = require("sudo-prompt");
const rl = require("readline-sync");

let hostmanIP = process.env.HOSTMAN_IP || "127.3.3.3";

new Promise((res, rej) => {
    console.log("hostman needs administrator privileges to bind http://hostman/ to http://" + hostmanIP + ":80/.");
    console.log("These actions are conducted by npm packages 'hosts-etc' and 'sudo-prompt'.");
    console.log("The code for this process is found in the postinstall.js script of the hostman package.");
    console.log("");

    let goAhead;
    do {
        // promisify this - but how do you dowhile in a promise?
        goAhead = rl.keyInYN("Are you happy to continue? [Y/n] ", {
            guide: false
        });
        goAhead = goAhead === "" ? true : goAhead;
    } while (typeof goAhead != "boolean");
    if (goAhead === false) rej({
        suppress: "ok.",
        errno: 2
    });
    let opts = {
        name: "hostman",
        //icns: "location to the favicon"
    };
    sudo.exec('node install/postinstall2.js', opts, (err, _, stderr) => err ? rej(err) : stderr ? rej(stderr) : res());
}).then(() => {
    console.log("Successfully mapped " + hostmanIP + " to hostman!");
}).catch(e => {
    if (e !== undefined) {
        console.error(e);
        process.exit(e.errno || 1);
    }
});