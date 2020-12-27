const api = require("./api/api");

module.exports = (router) => {
    router.get(".*", async function (req, res) {
        if (req.host === "hostman") return;
        // TODO: handle redirections
    });
};