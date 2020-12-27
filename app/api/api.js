const {
    version
} = require('../../package.json');
const hostsEtc = require('hosts-etc').useCache(false).promise;
const hostsJson = require("./hosts-json");
const doSudo = require("./sudoThis").doSudo;

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
    let hosts = (await hostsEtc.get("#hostman")).hostman || [];
    let jsons = (await hostsJson.get()) || [];
    hosts = hosts.concat(jsons);
    // TODO: Add HostsJSON redirects
    Promise.resolve().then(() => {
        invincibleHostnames = [];
        for (let host of hosts) {
            if (host.comment.includes("{invincible}")) invincibleHostnames.push(host.host);
        }
    });
    return hosts;
};

module.exports.set = async function set(host) {
    if (invincibleHostnames.includes(host.host)) throw new Error("Cannot modify invincible host!");

    host.host = host.host.trim();
    host.address = host.address.trim();
    host.comment = host.comment.trim();

    if (host.comment != "") {
        await module.exports.remove(host);
    }

    let ipRegex = /^(\d{1,3}\.){3}(\d{1,3})$/g; // rudimentary ip check
    let isRedirect = !ipRegex.test(host.address);

    host = genHost(host);
    console.log("Trying to set " + host.host + ", " + host.address);

    let r = "";

    if (!isRedirect) {
        r = parseInt(await doSudo("set", host));
    } else {
        r = parseInt(await hostsJson.set(host));
    }

    if (r > 0) r = host.comment;
    return r;
};

module.exports.remove = async function remove(host) {
    if (invincibleHostnames.includes(host.host)) throw new Error("Cannot remove invincible host!");

    let ipRegex = /^(\d{1,3}\.){3}(\d{1,3})$/g; // rudimentary ip check
    let isRedirect = !ipRegex.test(host.address);

    host = genHost(host);
    console.log("Trying to remove " + host.host + ", " + host.address);

    let r = "";

    if (!isRedirect) {
        r = parseInt(await doSudo("remove", host));
    } else {
        r = parseInt(await hostsJson.remove(host));
    }

    return r;
};

function genHost(host) {
    return {
        host: host.host,
        address: host.address,
        comment: host.comment || module.exports.hashHost(host),
        region: "hostman"
    };
}