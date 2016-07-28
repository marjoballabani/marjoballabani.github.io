/**
 * Created by Kostandin on 1/18/2016.
 */

var liveServer = require("live-server");

var params = {
    port: 9090,
    host: "localhost",
    open: true,
    quiet: true,
    file: "index.html",
    logLevel: 0,
    mount: [['/app', './node_modules', './lib']]
};

liveServer.start(params);