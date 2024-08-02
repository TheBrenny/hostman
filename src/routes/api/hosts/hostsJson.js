const hostsEtc = (await import('hosts-etc')).useCache(false).promise;
const doSudo = (await import("./sudoThis.mjs")).doSudo;
const path = (await import("path"));
const fs = (await import("fs")).promises;
const jsonFile = path.join(path.dirname(hostsEtc.HOSTS), "hostman_redirects.json");

await doSudo("testJson", jsonFile)
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


export async function get() {
    let d = (await fs.readFile(jsonFile)).toString()
    let json = JSON.parse(d);
    return json;
};
export async function set(host) {
    return doSudo("setRedirect", jsonFile, host);
};
export async function remove(host) {
    return doSudo("removeRedirect", jsonFile, host);
};