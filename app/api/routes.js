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
};

// TODO: You were gonna test the /api/ routes using insomnia!