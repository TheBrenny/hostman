// This script should write to the hosts file
const sudo = require("sudo-prompt");
const isAdmin = require("native-is-elevated");
const rl = require("readline-sync");

let hostmanIP = process.env.HOSTMAN_IP || "127.3.3.3";

Promise.resolve(isAdmin()).then(admin => {
    return new Promise((res, rej) => {
        console.log("hostman needs administrator privileges to bind http://hostman/ to http://" + hostmanIP + ":80/.");
        console.log("These actions are conducted by npm packages 'hostile', 'sudo-prompt' amd 'native-is-elevated'.");
        console.log("The code for this process is found in the postinstall.js script of the hostman package.");
        console.log("See LICENSE.md for more info.");
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
        sudo.exec('node install/postinstall2.js', opts, (err, _, stderr) => err || stderr ? rej(stderr) : res());
    });
}).catch(e => {
    if (e !== undefined) {
        if (!e.suppress) console.error(e);
        else if (typeof e.suppress !== "boolean") console.log(e.suppress);
        process.exit(e.errno ? e.errno : -1);
    }
});