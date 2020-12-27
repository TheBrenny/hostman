const hostsEtc = require('hosts-etc').useCache(false).promise;
const doSudo = require("./sudoThis").doSudo;
const path = require("path");
const fs = require("fs").promises;
const jsonFile = path.join(path.dirname(hostsEtc.HOSTS), "hostman_redirects.json");

doSudo("testJson", jsonFile)
    .then(t => {
        t = t.trim();
        console.log("JSON loaded: " + (t == "true"));
        return t == "true";
    })
    .catch(e => {
        throw {
            code: e,
            message: ("Cannot reach JSON Redirect File: " + e)
        };
    });


module.exports.get = async function get() {
    return fs.readFile(jsonFile)
        .then(d => JSON.parse(d))
        .then(json => {
            return json;
        });
};
module.exports.set = async function set(host) {
    return doSudo("setRedirect", jsonFile, host);
};
module.exports.remove = async function remove(host) {
    return doSudo("removeRedirect", jsonFile, host);
};