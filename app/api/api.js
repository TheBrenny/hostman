const {
    version
} = require('../../package.json');
const hostsEtc = require('hosts-etc').promise;

async function home() {
    return {
        version: version,
        hosts: (await hosts())
    };
}

async function hosts() {
    let hosts = await hostsEtc.get();

    let obj = {};

    return [];
}

module.exports.home = home;
module.exports.hosts = hosts;