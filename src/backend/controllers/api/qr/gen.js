import { info } from "@randajan/simple-app/info";
import { koaBody } from "koa-body";
import { qrDraw, qrSerializeIssues } from "../../../assets/qr/api";
import { getRec } from "../../../assets/db/sugars";
import { issuesSerialize } from "@randajan/1up-api/4server";


const setIssueHeaders = (prefix, ctx, issues = {})=>{
    const headers = issuesSerialize(prefix, issues);
    for (const h in headers) { ctx.set(h, headers[h]); }
}


const respondQrCode = async (ctx, config) => {
    const { apiToken, fileName, mime } = ctx.params;

    const qrApi = await getRec("qrApis", apiToken, false);
    if (!qrApi) { ctx.status = 404; return; }

    const e = await qrApi.eval([
        "qrStyle","isClosed", 
        "countDay", "countWeek", "countMonth",
        "limitDay", "limitWeek", "limitMonth",
        "defaultType", "allowTypes",
        "defaultEcc", "strictEcc",
        "defaultSize", "strictSize",
        "defaultLabel", "strictLabel"
    ], { byKey:true });

    if (!e.qrStyle) { ctx.status = 503; ctx.body = "Api definition missing required style"; return; }
    if (e.isClosed) { ctx.status = 410; return; }
    if (e.countDay >= e.limitDay) { ctx.status = 429; ctx.body = "Exhausted day limit"; return; }
    if (e.countWeek >= e.limitWeek) { ctx.status = 429; ctx.body = "Exhausted week limit"; return; }
    if (e.countMonth >= e.limitMonth) { ctx.status = 429; ctx.body = "Exhausted month limit"; return; }

    const altp = e.allowTypes;
    if (!config.contentType) { config.contentType = e.defaultType; }
    if (altp.length && !altp.includes(config.contentType)) { ctx.status = 406; return; }

    if (!config.ecc || e.strictEcc) { config.ecc = e.defaultEcc; }
    if (!config.size || e.strictSize) { config.size = e.defaultSize; }
    if (!config.label || e.strictLabel) { config.label = e.defaultLabel; }

    try {
        const r = await qrDraw(mime, e.qrStyle.key, config);
        qrApi.update({countDay:e.countDay+1, countWeek:e.countWeek+1, countMonth:e.countMonth+1});

        ctx.body = r.body;
        ctx.type = r.mimeType;
        setIssueHeaders("x-qr-issues-", ctx, r.issues);
        ctx.set("Content-Disposition", `inline; filename="${fileName}.${mime}"`);
        ctx.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        ctx.set('Pragma', 'no-cache');
        ctx.set('Expires', '0');
    } catch (err) {
        ctx.status = 500;
        ctx.body = err.message;
        if (!info.isBuild) { ctx.body += `\n\n${err.stack}`; }
    }
}

export default router => {
    router.use("/", [
        koaBody(),
    ]);

    router.get("/:apiToken/:fileName.:mime", async ctx => {
        await respondQrCode(ctx, ctx.query);
    });

    router.post("/:apiToken/:fileName.:mime", async ctx => {
        await respondQrCode(ctx, ctx.request.body);
    });
}
