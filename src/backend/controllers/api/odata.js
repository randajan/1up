import env from "@randajan/simple-app/env";
import odataResponder from "@randajan/odata-server/koa";

import { koaBody } from "koa-body";

import { odata } from "../../assets/db/odata.js";
import { odataAuth } from "../../assets/auth/index.js";



export default router => {
    router.use("/", odataAuth);
    router.use("/", koaBody());
    router.all("/appsheet/:s*", odata.serve(odataResponder, env.home+"/api/odata/appsheet", { tzWorkaround: true, useTimespan: true }));
    router.all("/raws/:s*", odata.serve(odataResponder, env.home+"/api/odata/raws"));
    router.all("/vals/:s*", odata.serve(odataResponder, env.home+"/api/odata/vals", { returnVals: true }));
}

