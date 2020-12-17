const path = require('path');
const fs = require('fs');
const api = require("../api/api");
const scetch = require('scetch')({
    root: path.join(__dirname, "views")
});

let mime = {
    html: 'text/html',
    txt: 'text/plain',
    css: 'text/css',
    gif: 'image/gif',
    jpg: 'image/jpeg',
    png: 'image/png',
    svg: 'image/svg+xml',
    js: 'application/javascript'
};

let render = async (file, opts) => {
    let d = await scetch.engine(file, opts);
    return d;
};

module.exports = (router) => {
    router.get("/assets/(.*)", async function (req, res) {
        return new Promise((resolve, reject) => {
            let f = req.matches[0][1];
            let type = mime[path.extname(f).slice(1)] || 'text/plain';

            let s = fs.createReadStream(path.join(__dirname, "assets", f));
            s.on('open', () => {
                res.setHeader('Content-Type', type);
            });
            s.on('data', (data) => {
                res.write(data);
            });
            s.on('end', () => {
                res.end();
                resolve();
            });
            s.on('error', (error) => reject(error));

        });
    });
    router.get("/", async function (req, res) {
        return render("home", await api.home()).then(data => {
            res.setHeader("Content-Type", "text/html");
            res.write(data);
            res.end();
        });
    });
};