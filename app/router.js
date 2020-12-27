// https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
const errors = require("./errorCodes");
const routes = {
    get: {},
    post: {},
    delete: {},
};

function getAcceptedResponseFormat(req, ...data) {
    let accept = ["text/plain", d => JSON.stringify(d)];
    let acceptPos = req.headers.accept.length + 1;

    // Allows for extensibility if we want more formats
    [
        ["text/html", (d) => `<pre>${
            Object.getOwnPropertyNames(d).map(n => n + ": " + d[n]).join("</pre><pre>")
        }</pre>`],
        ["application/json", (d) => JSON.stringify(d)]
    ].forEach(el => {
        let idx = req.headers.accept.indexOf(el[0]);
        if (idx < 0) return;
        if (idx < acceptPos) {
            acceptPos = idx;
            accept = el;
        }
    });

    // overwrite the fn instead of making a new object.
    // turns object 'd' to string.
    accept[1] = data.map(d => typeof d !== "undefined" ? accept[1](d) : "undefined").join("");

    return {
        data: accept[1],
        contentType: accept[0],
        statusCode: (data.find((v) => v.statusCode) || {
            statusCode: 200
        }).statusCode
    };
}

function writeError(req, res, err, noHead) {
    head = !noHead;
    err = ["object", "number"].includes(typeof err) ? err : 500;
    err = typeof err === "number" ? getAcceptedResponseFormat(req, errors[err]) : err;

    if (head) {
        res.setHeader("Content-Type", err && err.contentType || "text/plain");
        res.statusCode = err && err.statusCode || 500;
    }
    res.end(err.data || errors[500].msg);
}

module.exports = async function (req, res) {
    let method = req.method.toLowerCase();
    let error;

    if (routes[method.toLowerCase()] === undefined) {
        error = getAcceptedResponseFormat(req, errors[405]);
    } else {
        // Loop through all our registered routes
        for (let r in routes[method.toLowerCase()]) {
            let matches = [...req.url.matchAll(`^${r}$`)]; // check for matches

            if (Array.isArray(matches) && matches.length > 0) {
                // If we have a  match, reset error
                error = {};
                req.accepts = req.headers.accept;
                req.host = req.headers.host;
                req.matches = matches;

                // Safely handle errors
                try {
                    // routes RETURN errors. returns undefined if all good.
                    error = await routes[method][r](req, res);
                    if (res.headersSent) break; // if tx started, break to stop matching
                } catch (e) {
                    // Otherwise, catch the error (probably from the promise) and try a new match

                    error = {
                        statusCode: 500,
                        msg: 500 + " " + errors[500].msg + " Problem resolving route: " + matches.join(", "),
                        stack: e.stack
                    };

                    error = getAcceptedResponseFormat(req, error);
                }

                // Commented bc We don'r want to lose the chance that another handler can tx. (eg 404)
                // break;
            }
        }
    }

    if (error) {
        let noHead = typeof res.headersSent !== "undefined" && res.headersSent == true;
        writeError(req, res, error, noHead);
    }
};

module.exports[404] = async function (req, res) {
    if (!res.headersSent) writeError(req, res, 404);
};

module.exports.register = (routes) => {
    routes(module.exports);
};

// fn has signature: function(req, res, obj)
//   req is the request object from http package
//   res is the response object from http package
//   obj is an object containing the matches, acceptance type, nethod, host, and url
module.exports.get = function (uri, fn) {
    if (routes.get[uri] != undefined) console.log(" ----- Writing over " + uri + "! Is this what you meant?");
    routes.get[uri] = fn;
};
module.exports.post = function (uri, fn) {
    routes.post[uri] = fn;
};
module.exports.delete = function (uri, fn) {
    routes.delete[uri] = fn;
};