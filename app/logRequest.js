module.exports = (req, res) => {
    const timestamp = new Date().toLocaleString();
    let timer = process.hrtime.bigint();

    // time: METHOD host url -- elapsed -- status
    res.on('finish', () => {
        timer = Number((process.hrtime.bigint() - timer) / BigInt(1000000));
        const method = req.method;
        const host = req.headers.host;
        const url = req.url;
        const statCode = res.statusCode;
        const statMsg = res.statusMessage;

        console.log(`${timestamp} -- ${method} ${host}${url} -- ${timer}ms -- ${statCode} ${statMsg}`);
    });
};