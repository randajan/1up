import be, { app } from "@randajan/simple-app/be/koa";
import env from "@randajan/simple-app/env";
import { importFiles } from "@randajan/simple-app/fs";
import log from "@randajan/simple-app/log";

import jet from "@randajan/jet-core";

import Router from "koa-router";


import "./init.js";
// import "./bots/**";
// import "./crone";
// import "./migration.js";
import * as routes from "./controllers/**/*.js";


const _routers = [];
importFiles(routes, {
    prefix: "./controllers",
    suffix: ".js",
    trait: ({ default: setupRouter }, prefix) => {
        if (prefix.endsWith("index")) { prefix = prefix.slice(0, -6); }
        const router = new Router(prefix === "index" ? {} : { prefix });
        try { setupRouter(router); } catch (err) { log.red(err); }
        _routers.push(router);
        app.use(router.routes()).use(router.allowedMethods())
    }
});

be.start(env.port);


