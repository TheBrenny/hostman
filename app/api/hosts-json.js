const {
    version
} = require('../../package.json');
const hostsEtc = require('hosts-etc').useCache(false).promise;
const sudo = require("sudo-prompt");
const path = require("path");

const jsonFile = path.join(path.dirname(hostsEtc.HOSTS), "hostman_redirects.json");