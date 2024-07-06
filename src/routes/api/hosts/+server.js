import {json} from '@sveltejs/kit';
const hostsEtc = (await import("hosts-etc")).useCache(false).promise;
const hostsJson = (await import("./hostsJson"));

let invincibles;

/** @type {import('./$types').RequestHandler} */
export async function GET() {
    try {
        let hosts = (await hostsEtc.get("#hostman")).hostman || [];
        let jsons = (await hostsJson.get()) || [];
        hosts = [...hosts, ...jsons];

        invincibles = [];
        for(let host of hosts) if(host.comment.includes("{invincible}")) invincibles.push(host.host);

        return json(hosts);
    } catch(e) {
        console.error(e);
        return json(e, {status: 500});
    }
};

export async function POST() {
    return new Response();
}

export async function DELETE() {
    return new Response();
}