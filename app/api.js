const {
    version
} = require('../package.json');
const hostile = require('hostile');

async function home() {
    return {
        version: version,
        hosts: (await hosts())
    };
}

async function hosts() {
    let lines = hostile.get(true);

    let obj = {};

    return {

    };
}

module.exports.home = home;
module.exports.hosts = hosts;