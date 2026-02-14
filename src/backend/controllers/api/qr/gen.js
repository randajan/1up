import { info } from "@randajan/simple-app/info";
import { koaBody } from "koa-body";
import { Resvg } from "@resvg/resvg-js";
import { getValue } from "../../../assets/db/sugars";
import { configFields, QrGen } from "../../../../arc/qrGen";
import { createCanvas } from "canvas";

const canvas = createCanvas();

const getStyle = async (styleId)=>getValue("qrStyles", styleId, "style", false);

const resolveQrSvg = async (styleId, body) => {
    if (!body) { throw new Error("Missing body"); }

    const style = await getStyle(styleId);
    if (!style) { throw new Error(`Style not found`); }

    const { result, issues } = configFields.format(body);

    if (issues.critical) { throw new Error("Issues: " + JSON.stringify(issues)); }

    return QrGen.create({ canvas }).setStyle(style).setConfig(result).render();
}

const resolveQrPng = async (styleId, body)=>{
    const svg = await resolveQrSvg(styleId, body);
    const resvg = new Resvg(svg);
    return resvg.render().asPng();
}

const _mimeTypes = new Map();
_mimeTypes.set("svg", ['image/svg+xml; charset=utf-8', resolveQrSvg]);
_mimeTypes.set("png", ['image/png', resolveQrPng]);


const resolveQrCode = async (ctx, body)=>{
    if (!body) { throw new Error("Missing body"); }

    const { styleId, fileName, mime } = ctx.params;
    const kind = _mimeTypes.get(mime);

    if (!kind) { throw new Error(`Mimetype must be '${[..._mimeTypes.keys()].join("' or '")}'`); }

    const [ type, resolve ] = kind;

    ctx.body = await resolve(styleId, body);

    ctx.type = type;
    ctx.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    ctx.set('Pragma', 'no-cache');
    ctx.set('Expires', '0');

}

const respondQrCode = async (ctx, body) => {
    try {
        await resolveQrCode(ctx, body);
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