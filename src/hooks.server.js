import {get as getHosts} from "./routes/api/hosts/hostsJson.js"

let hostmanHost = process.env["HOST"];

export async function handle({event, resolve}) {
    const incomingHost = event.request.headers.get("host") ?? null;
    if(incomingHost === null || incomingHost.toLowerCase() === hostmanHost?.toLowerCase()) return await resolve(event);

    let hosts = await getHosts();
    
    let host = hosts.find(h => h.host === incomingHost); // MAYBE: This will fail if we ever want to bind to different ports!
    if(host === null || host === undefined) return await resolve(event);
    
    let hasProtocol = host.address.includes("://");

    const response = new Response(null, {
        status: 302,
        headers: {
            'Location': (!hasProtocol ? 'https://' : "") + host.address
        }
    });

    return response;
}