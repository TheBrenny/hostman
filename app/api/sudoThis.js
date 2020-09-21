const hosts = require("hosts-etc");
let a = process.argv[2];
let h = JSON.parse(process.env.HOSTMAN_TARGET);

// TODO: Check if host is invincible, if so, refuse to act on it.

if (a === "set") {
    console.log(hosts.set(h));
} else if (a === "remove") {
    console.log(hosts.remove(h.host));
}