import {json} from '@sveltejs/kit';
const hostsEtc = (await import("hosts-etc")).useCache(false).promise;
const hostsJson = (await import("./hostsJson"));
const doSudo = (await import("./sudoThis.mjs")).doSudo;

/** @type {Array<string>} */
let invincibles = [];

/** @type {import('./$types').RequestHandler} */
export async function GET() {
    try {
        let hosts = (await hostsEtc.get("#hostman")).hostman || [];
        let jsons = (await hostsJson.get()) || [];
        hosts = [...hosts, ...jsons];

        invincibles = [];
        for(let host of hosts) {
            if(host.comment.includes("{invincible}")) invincibles.push(host.host);
            host.hash = host.comment;
            delete host.comment;
        }

        return json(hosts);
    } catch(e) {
        console.error(e);
        return json(e, {status: 500});
    }
};

export async function POST({request}) {
    try {
        let data = await request.json();

        if(invincibles.includes(data.host.hash)) throw new Error("Cannot modify invincible host!");

        let host = {
            host: data.host.trim(),
            address: data.address.trim(),
            comment: data.hash.trim()
        };

        if(host.comment === "") host.comment = hashHost(host);

        let ipRegex = /^(\d{1,3}\.){3}(\d{1,3})$/g;
        let isRedirect = !ipRegex.test(host.address);

        console.log(`Trying to set '${host.host}' to '${host.address}'.`)

        let r; // our functions return the number of hosts changed... %%
        if(isRedirect) r = parseInt(await hostsJson.set(host)); // redirect json
        else r = parseInt(await doSudo("set", host)); // into the hosts file

        if(r > 0) r = host.comment;
        else throw new Error("Something went wrong...");

        return json({status: 0, updated: 1, hash: r, host});
    } catch(e) {
        // @ts-ignore
        return json({status: 1, updated: 0, message: e.message, error: e}, {status: 500});
    }
}

export async function DELETE({request}) {
    try {
        let data = await request.json();

        if(invincibles.includes(data.host.hash)) throw new Error("Cannot modify invincible host!");

        let host = {
            host: data.host.trim(),
            address: data.address.trim(),
            comment: data.hash.trim()
        };

        if(host.comment === "") host.comment = hashHost(host);

        let ipRegex = /^(\d{1,3}\.){3}(\d{1,3})$/g;
        let isRedirect = !ipRegex.test(host.address);

        console.log(`Trying to remove '${host.host}' to '${host.address}'.`)

        let r; // our functions return the number of hosts changed... %%
        if(isRedirect) r = parseInt(await hostsJson.remove(host)); // redirect json
        else r = parseInt(await doSudo("remove", host)); // into the hosts file

        if(r > 0) r = host.comment;
        else throw new Error("Something went wrong...");

        return json({status: 0, updated: 1, hash: r, host});
    } catch(e) {
        // @ts-ignore
        return json({status: 1, updated: 0, message: e.message, error: e}, {status: 500});
    }
}


/** @param {{ host: string; address: string; }} host */
function hashHost(host) {
    let hash = 0;
    let str = host.host + "" + host.address;
    for(let i = 0; i < str.length; i++) {
        let chr = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash.toString(16);
};