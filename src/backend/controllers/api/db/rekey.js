
import { fdb } from "../../../assets/db/files";
import db from "../../../assets/db/ramdb";
import { addMinutes, isAfter } from "date-fns";

const _expiresAt = addMinutes(new Date(), 5);

export default router => {

    router.post("/", async ctx => {
        if (isAfter(new Date(), _expiresAt)) { ctx.status = 403; return; }

        const { currentKey, newKey } = ctx.query;
        const res = await fdb.rekey(newKey, currentKey);

        if (res.isOk) { await db.reset(); }
        else {
            res.errors = res.errors.map(([name, err]) => [name, err.message || err]);
            ctx.status = 400;
        }

        ctx.set("Content-Type", "application/json");
        ctx.body = JSON.stringify(res);

    });

}
