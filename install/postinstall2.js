const hosts = require("hosts-etc");

let host = {
    host: "hostman",
    address: "127.3.3.3",
    region: "hostman",
    comment: "hostman {invincible}"
};

hosts.set(host);