const hosts = (await import("hosts-etc"));
const fs = (await import("fs"));
const sudo = (await import("sudo-prompt"));
const url = (await import("url"));
// let h = JSON.parse(process.env.HOSTMAN_TARGET);

function redirectify(h) {
    return Object.assign({}, h, {
        region: "hostman-redirects",
        address: "127.3.3.3"
    });
}

function set(h) {
    console.log(hosts.set(h));
};
function remove(h) {
    console.log(hosts.remove("c#" + h.comment));
};

function setRedirect(f, h) {
    let json = JSON.parse(fs.readFileSync(f).toString());
    json.push(h);
    fs.writeFileSync(f, JSON.stringify(json));
    hosts.set(redirectify(h));
    console.log(1);
};
function removeRedirect(f, h) {
    let json = JSON.parse(fs.readFileSync(f).toString());
    json = json.filter(host => host.comment !== h.comment);
    fs.writeFileSync(f, JSON.stringify(json));
    hosts.remove("c#" + h.comment);
    console.log(1);
};

function testJson(f) {
    try {
        fs.accessSync(f);
    } catch(e) {
        if(e.code == "ENOENT") fs.writeFileSync(f, "[]");
        else console.error(e.code);
    }
    console.log(true);
};

async function doSudo(action, ...params) {
    params = (params || []).map(p => JSON.stringify(p).replace(/"/g, "'"));
    return new Promise((resolve, reject) => {
        let node = process.argv[0];
        let sudoThis = url.pathToFileURL(import.meta.filename);

        // @ts-ignore
        params = params.join(", ");
        sudo.exec(`${node} --import="${sudoThis.href}" -e "import('${sudoThis.href}').then((mod) => mod.${action}(${params}))"`, {
            name: "hostman",
        }, (err, stdout, stderr) => {
            if(err || stderr) {
                console.error(err || stderr);
                // @ts-ignore
                reject(err || JSON.parse(stderr));
            } else {
                resolve(stdout);
            }
        });
    });
};

export {
    doSudo,
    redirectify,
    set,
    remove,
    setRedirect,
    removeRedirect,
    testJson
}