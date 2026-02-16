import { info } from "@randajan/simple-app/info";
import { koaBody } from "koa-body";
import { qrDraw, qrSerializeIssues } from "../../../assets/qr/api";
import { getRec } from "../../../assets/db/sugars";

const setIssueHeaders = (ctx, issues = {})=>{
    for (const level in issues) {
        const iss = qrSerializeIssues(issues[level]);
        if (iss) { ctx.set(`x-qr-issues-${level}`, iss); }
    }
}


const respondQrCode = async (ctx, config) => {
    const { apiToken, fileName, mime } = ctx.params;

    const qrApi = await getRec("qrApis", apiToken, false);
    if (!qrApi) { ctx.status = 404; return; }

    const [ style, isClosed, isExhausted, useCount ] = await qrApi.eval(["qrStyle","isClosed", "isExhausted", "useCount"]);

    if (!style) { ctx.status = 503; ctx.body = "Api definition missing required style"; return; }
    if (isClosed) { ctx.status = 410; return; }
    if (isExhausted) { ctx.status = 429; return; }

    try {
        
        const r = await qrDraw(mime, style.key, config);
        qrApi.update({useCount:useCount+1});

        ctx.body = r.body;
        ctx.type = r.mimeType;
        setIssueHeaders(ctx, r.issues);
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
