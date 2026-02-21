
import { fdb } from "../../../assets/db/files";
import db from "../../../assets/db/ramdb";

export default router => {

    router.post("/", async ctx => {
        const { key } = ctx.query;
        const res = await fdb.unlock(key);

        if (res.isOk) { await db.reset(); }
        else {
            res.errors = res.errors.map(([name, err]) => [name, err.message || err]);
            ctx.status = 400;
        }

        ctx.set("Content-Type", "application/json");
        ctx.body = JSON.stringify(res);

    });

}


