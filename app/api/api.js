const {
    version
} = require('../../package.json');
const hostsEtc = require('hosts-etc').useCache(false).promise;
const sudo = require("sudo-prompt");
const path = require("path");

let invincibleHostnames = [];

module.exports.hashHost = function hashHost(host) {
    let hash = 0;
    let str = host.host + "" + host.address;
    for (let i = 0; i < str.length; i++) {
        let chr = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash.toString(16);
};

module.exports.home = async function home() {
    return {
        version: version,
        hosts: (await this.hosts())
    };
};
module.exports.hosts = async function hosts() {
    let h = (await hostsEtc.get("#hostman")).hostman || [];
    Promise.resolve().then(() => {
        invincibleHostnames = [];
        for (let host of h) {
            if (host.comment.includes("{invincible}")) invincibleHostnames.push(host.host);
        }
    });
    return h;
};

module.exports.set = async function set(host) {
    host = genHost(host);
    return parseInt(await doSudo("set", host));
};

module.exports.remove = async function remove(host) {
    if (invincibleHostnames.includes(host.host)) throw new Error("Cannot remove invincible host!");
    host = genHost(host);
    return parseInt(await doSudo("remove", host));
};

function genHost(host) {
    return {
        host: host.host,
        address: host.address,
        comment: module.exports.hashHost(host),
        region: "hostman"
    };
}

async function doSudo(action, host) {
    host = JSON.stringify(host);
    return new Promise((resolve, reject) => {
        sudo.exec(process.argv[0] + " \"" + path.join(__dirname, "sudoThis.js") + "\" " + action, {
            env: {
                HOSTMAN_TARGET: host
            }
        }, (err, stdout, stderr) => {
            if (err || stderr) {
                reject(err || JSON.parse(stderr));
            } else {
                resolve(stdout);
            }
        });
    });
}