
import be, { app, io } from "@randajan/simple-app/be/koa";
import env from "@randajan/simple-app/env";
import info from "@randajan/simple-app/info";
import jet from "@randajan/jet-core";
import serve from "koa-static";
import send from "koa-send";
import path from "node:path";

import { bridgeSession } from "@randajan/koa-io-session";
import { FileStore } from "@randajan/koa-io-session/fdb";

app.proxy = true;

export const sessionBridge = bridgeSession(app, io, {
    ...env.session,
    store:new FileStore({

        fdbOpt:{
            dir:path.join(info.dir.root, `../drive/session`),
        }
    }),
    httpOnly: true,
});


app.use(serve(info.dir.fe));

app.use(async (ctx, next) => {
    await next();
    if (ctx.status !== 404) { return; }
    await send(ctx, "./index.html", { root: info.dir.fe });
});

process.on("uncaughtException", err => {
    console.warn("Uncaught!!!");
    console.error(err);
});