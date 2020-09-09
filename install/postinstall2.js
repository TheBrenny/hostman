const hostile = require("hostile");

hostile.set("127.3.3.3", "hostman", (e) => {
    if (e !== undefined) {
        console.error(e);
    }
});