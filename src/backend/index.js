import be, { app } from "@randajan/simple-app/be/koa";
import env from "@randajan/simple-app/env";
import odataResponder from "@randajan/odata-server/koa";

import Router from "koa-router";
import { koaBody } from "koa-body";

import { presurePlate } from "./assets/presurePlate/index.js";

import { odata } from "./assets/db/odata.js";
import { odataAuth } from "./assets/auth/index.js";


const router = new Router();


router.get("/:key", presurePlate(ctx=>{
    const key = ctx.params.key;
    if (!isNaN(Number(key[0]))) { return key; }
}));

router.use("/api/odata", odataAuth);
router.use("/api/odata", koaBody());
router.all("/api/odata/appsheet/:s*", odata.serve(odataResponder, env.home+"/api/odata/appsheet", { tzWorkaround: true, useTimespan: true }));
router.all("/api/odata/raws/:s*", odata.serve(odataResponder, env.home+"/api/odata/raws"));
router.all("/api/odata/vals/:s*", odata.serve(odataResponder, env.home+"/api/odata/vals", { returnVals: true }));

app.use(router.routes()).use(router.allowedMethods());

be.start(env.port);
