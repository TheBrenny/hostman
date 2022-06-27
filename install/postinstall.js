// This script should write to the hosts file
const sudo = require("sudo-prompt");

let hostmanIP = process.env.HOSTMAN_IP || "127.3.3.3";

new Promise(async (res, rej) => {
    console.log("hostman needs administrator privileges to bind http://hostman/ to http://" + hostmanIP + ":80/.");
    console.log("These actions are conducted by npm packages 'hosts-etc' and 'sudo-prompt'.");
    console.log("The code for this process is found in the postinstall.js script of the hostman package.");
    console.log("");
    console.log("Sleeping for 5 seconds... Press Ctrl+C to cancel.");

    await new Promise((resolve, reject) => setTimeout(resolve, 5000));
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