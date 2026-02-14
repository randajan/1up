import { info } from "@randajan/simple-app/info";
import { koaBody } from "koa-body";
import { qrDraw, qrSerializeIssues } from "../../../assets/qr/api";

const setIssueHeaders = (ctx, issues = {})=>{
    for (const level in issues) {
        const iss = qrSerializeIssues(issues[level]);
        if (iss) { ctx.set(`x-qr-issues-${level}`, iss); }
    }
}

const respondQrCode = async (ctx, config) => {
    try {
        const { styleId, fileName, mime } = ctx.params;
        const r = await qrDraw(mime, styleId, config);
        ctx.body = r.body;
        ctx.type = r.mimeType;
        setIssueHeaders(ctx, r.issues);
        ctx.set("Content-Disposition", `inline; filename="${fileName}.${mime}"`);

        ctx.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        ctx.set('Pragma', 'no-cache');
        ctx.set('Expires', '0');
    } catch (err) {
        ctx.status = 400;
        ctx.body = err.message;
        if (!info.isBuild) { ctx.body += `\n\n${err.stack}`; }
    }
}

export default router => {
    router.use("/", [
        koaBody(),
    ]);

    router.get("/:styleId/:fileName.:mime", async ctx => {
        await respondQrCode(ctx, ctx.query);
    });

    router.post("/:styleId/:fileName.:mime", async ctx => {
        await respondQrCode(ctx, ctx.request.body);
    });
}
