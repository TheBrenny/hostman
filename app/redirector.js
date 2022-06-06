const hostsJson = require("./api/hosts-json");

module.exports = (router) => {
    router.get(".*", async function (req, res) {
        if(req.host === "hostman") return;
        let hosts = await hostsJson.get();
        let host = hosts.find(h => h.host === req.host);
        let hasProtocol = host.address.includes("://");

        res.writeHead(302, {
            'Location': (!hasProtocol ? 'https://' : "") + host.address
        });
        res.end();
    });
};