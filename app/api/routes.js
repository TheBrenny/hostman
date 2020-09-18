module.exports = (router) => {
    router.get("/api/", async function (req, res) {
        return api.home()
            .then(data => {
                res.setHeader("Content-Type", "application/json");
                res.write(JSON.stringify(data));
                res.end();
            });
    });
    router.get("/api/hosts", async function (req, res) {
        return api.home()
            .then(data => {
                res.setHeader("Content-Type", "application/json");
                res.write(JSON.stringify(data));
                res.end();
            });
    });
};