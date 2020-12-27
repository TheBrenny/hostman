const hosts = require("hosts-etc");
const fs = require("fs");
const path = require("path");
const sudo = require("sudo-prompt");
// let h = JSON.parse(process.env.HOSTMAN_TARGET);

// TODO: Check if host is invincible, if so, refuse to act on it.

function redirectify(h) {
    return Object.assign({}, h, {
        region: "hostman-redirects",
        address: "127.3.3.3"
    });
}

module.exports.set = (h) => {
    console.log(hosts.set(h));
};
module.exports.remove = (h) => {
    console.log(hosts.remove("c#" + h.comment));
};

module.exports.setRedirect = (f, h) => {
    let json = JSON.parse(fs.readFileSync(f));
    json.push(h);
    fs.writeFileSync(f, JSON.stringify(json));
    hosts.set(redirectify(h));
    console.log(1);
};
module.exports.removeRedirect = (f, h) => {
    let json = JSON.parse(fs.readFileSync(f));
    json = json.filter(host => host.comment !== h.comment);
    fs.writeFileSync(f, JSON.stringify(json));
    hosts.remove("c#" + h.comment);
    console.log(1);
};

module.exports.testJson = (f) => {
    try {
        fs.accessSync(f);
    } catch (e) {
        if (e.code == "ENOENT") fs.writeFileSync(f, "[]");
        else console.error(e.code);
    }
    console.log(true);
};

module.exports.doSudo = async function doSudo(action, ...params) {
    params = (params || []).map(p => JSON.stringify(p).replace(/"/g, "'"));
    return new Promise((resolve, reject) => {
        let node = process.argv[0];
        let sudoThis = path.join(__dirname, "sudoThis.js");
        params = params.join(", ");
        sudo.exec(`${node} -r "${sudoThis}" -e "require('${sudoThis.replace(/\\/g, "\\\\")}').${action}(${params})"`, {
            name: "hostman",
            //icns: "favicon.ico"
        }, (err, stdout, stderr) => {
            if (err || stderr) {
                console.error(err || stderr);
                reject(err || JSON.parse(stderr));
            } else {
                resolve(stdout);
            }
        });
    });
};