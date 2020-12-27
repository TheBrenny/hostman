const api = require('./api');


module.exports = (router) => {
    router.get("/api/", async function (_, res) {
        return api.home()
            .then(data => {
                res.setHeader("Content-Type", "application/json");
                res.write(JSON.stringify(data));
                res.end();
            });
    });
    router.get("/api/hosts", async function (_, res) {
        return api.hosts()
            .then(data => {
                res.setHeader("Content-Type", "application/json");
                res.write(JSON.stringify(data));
                res.end();
            });
    });
    router.post("/api/hosts", async function (req, res) {
        let data = [];

        req.on('data', chunk => {
            data.push(chunk);
        });


        return new Promise((resolve, reject) => {
            req.on('error', e => reject(e));
            req.on('end', () => resolve(JSON.parse(Buffer.concat(data))));
        }).then(api.set).then((hash) => {
            if (hash === 0) throw new Error("Host wasn't updated!");
            res.write(JSON.stringify({
                status: 0,
                updated: 1,
                hash: hash
            }));
        }).catch(e => {
            // write error
            res.write(JSON.stringify({
                status: 1,
                updated: 0,
                message: e.message,
                error: e
            }));
        }).finally(() => res.end());
    });
    router.delete("/api/hosts", async function (req, res) {
        let data = [];

        req.on('data', chunk => {
            data.push(chunk);
        });


        return new Promise((resolve, reject) => {
            req.on('error', e => reject(e));
            req.on('end', () => resolve(JSON.parse(data)));
        }).then(api.remove).then((updated) => {
            if (updated === 0) throw new Error("Host wasn't updated!");
            res.write(JSON.stringify({
                status: 0,
                updated: updated
            }));
        }).catch(e => {
            // write error
            res.write(JSON.stringify({
                status: 1,
                updated: 0,
                message: e.message,
                error: e
            }));
        }).finally(() => res.end());
    });
};

// TODO: You were gonna test the /api/ routes using insomnia!