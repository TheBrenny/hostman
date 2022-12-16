const hostsJson = require("./api/hosts-json");

const serverInfo = {
    host: process.env.HOSTMAN_HOST,
    port: process.env.HOSTMAN_PORT
}

module.exports = (router) => {
    router.get("", async function (req, res) {
        if(req.host.substring(0, req.host.indexOf(":") ?? -1) === serverInfo.host) return;
        let hosts = await hostsJson.get();
        let host = hosts.find(h => h.host === req.host);
        let hasProtocol = host.address.includes("://");

        res.writeHead(302, {
            'Location': (!hasProtocol ? 'https://' : "") + host.address
        });
        res.end();
    });
};