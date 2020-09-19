const {
    version
} = require('../../package.json');
const hostsEtc = require('hosts-etc').promise;

module.exports.home = async function home() {
    return {
        version: version,
        hosts: (await this.hosts())
    };
};
module.exports.hosts = async function hosts() {
    let h = (await hostsEtc.get("#hostman")).hostman || [];
    return h;
};