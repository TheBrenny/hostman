// https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
const errors = require("./errorCodes");
const routes = {
    get: {},
    post: {}
};

function getAcceptedResponseFormat(req, code, message) {
    if(typeof message === "undefined") {
        message = code.msg;
        code = code.statusCode;
    }

    let accept = ["text/plain", m => m];
    let acceptPos = req.headers.accept.length + 1;

    // Allows for extensibility if we want more formats
    [
        ["text/html", (m) => `<p>${m}</p>`],
        ["application/json", (m) => `{"msg":"${m}"}`]
    ].forEach(el => {
        let idx = req.headers.accept.indexOf(el[0]);
        if (idx < 0) return;
        if (idx < acceptPos) {
            acceptPos = idx;
            accept = el;
        }
    });

    // overwrite the fn instead of making a new object.
    accept[1] = accept[1](message);

    return {
        contentType: accept[0],
        statusCode: code,
        data: accept[1]
    };
}

function writeError(res, err) {
    err = err || errors[500];

    if(!res.headersSent) res.setHeader("Content-Type", err && err.contentType || "text/plain");
    res.statusCode = err && err.statusCode;
    res.end(err.data || err);
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
                    error = getAcceptedResponseFormat(req, 500, "Problem resolving route: " + matches);
                }

                // Commented bc We don'r want to lose the chance that another handler can tx. (eg 404)
                // break;
            }
        }
    }
    
    if (error) {
        if(typeof error.headersSent !== "undefined" && error.headersSent == true) {
            res.end(error);
        } else {
            writeError(res, error);
        }
    }
};

module.exports[404] = async function (req, res) {
    if (!res.headersSent) writeError(res, getAcceptedResponseFormat(req, errors[404]));
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