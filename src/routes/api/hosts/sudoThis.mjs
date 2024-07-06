const hosts = (await import("hosts-etc"));
const fs = (await import("fs"));
const path = (await import("path"));
const sudo = (await import("sudo-prompt"));
// let h = JSON.parse(process.env.HOSTMAN_TARGET);

// TODO: Check if host is invincible, if so, refuse to act on it.

function redirectify(h) {
    return Object.assign({}, h, {
        region: "hostman-redirects",
        address: "127.3.3.3"
    });
}

export function set(h) {
    console.log(hosts.set(h));
};
export function remove(h) {
    console.log(hosts.remove("c#" + h.comment));
};

export function setRedirect(f, h) {
    let json = JSON.parse(fs.readFileSync(f));
    json.push(h);
    fs.writeFileSync(f, JSON.stringify(json));
    hosts.set(redirectify(h));
    console.log(1);
};
export function removeRedirect(f, h) {
    let json = JSON.parse(fs.readFileSync(f));
    json = json.filter(host => host.comment !== h.comment);
    fs.writeFileSync(f, JSON.stringify(json));
    hosts.remove("c#" + h.comment);
    console.log(1);
};

export function testJson(f) {
    try {
        fs.accessSync(f);
    } catch(e) {
        if(e.code == "ENOENT") fs.writeFileSync(f, "[]");
        else console.error(e.code);
    }
    console.log(true);
};

export async function doSudo(action, ...params) {
    params = (params || []).map(p => JSON.stringify(p).replace(/"/g, "'"));
    return new Promise((resolve, reject) => {
        let node = process.argv[0];
        let sudoThis = new URL("./sudoThis.mjs", import.meta.url);
        // if(OS.toLowerCase().includes("_nt")) {
        //     sudoThis = sudoThis.substring(1);
        //     sudoThis = sudoThis.replace(/\//g, "\\\\");
        // }
        params = params.join(", ");
        sudo.exec(`${node} --import="${sudoThis.href}" -e "import('${sudoThis.href}').then((mod) => mod.${action}(${params}))"`, {
            name: "hostman",
        }, (err, stdout, stderr) => {
            if(err || stderr) {
                console.error(err || stderr);
                reject(err || JSON.parse(stderr));
            } else {
                resolve(stdout);
            }
        });
    });
};