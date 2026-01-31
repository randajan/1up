import be, { app } from "@randajan/simple-app/be/koa";
import env from "@randajan/simple-app/env";
import odataResponder from "@randajan/odata-server/koa";

import Router from "koa-router";
import { koaBody } from "koa-body";

import { presurePlate } from "./assets/presurePlate/index.js";

import { odata } from "./assets/db/odata.js";


app.use(presurePlate(ctx=>{
    return ctx.path?.startsWith("/$odata");
}));

const router = new Router();

router.use(koaBody());

router.all("/$odata/appsheet/:s*", odata.serve(odataResponder, env.home+"/$odata/appsheet", { tzWorkaround: true, useTimespan: true }));
router.all("/$odata/raws/:s*", odata.serve(odataResponder, env.home+"/$odata/raws"));
router.all("/$odata/vals/:s*", odata.serve(odataResponder, env.home+"/$odata/vals", { returnVals: true }));

app.use(router.routes()).use(router.allowedMethods());

be.start(env.port);



