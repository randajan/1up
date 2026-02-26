import { Resvg } from "@resvg/resvg-js";
import { getRec, getValue } from "../db/sugars";
import { configForm } from "@randajan/1up-api/4server";
import { QrGen } from "../../../arc/qrGen";
import { createCanvas } from "canvas";
import db from "../db/ramdb";

const _types = new Map();
const canvas = createCanvas();

const getStyle = async (styleId)=>getValue("qrStyles", styleId, "style", false);

const qrDrawSVG = async (styleId, config) => {
    if (!config) { throw new Error("Missing config"); }

    const style = await getStyle(styleId);
    if (!style) { throw new Error(`Style not found`); }
    
    const { result, issues } = configForm.format(config);
    const r = { issues, mimeType:'image/svg+xml; charset=utf-8' };

    if (issues.maxLevel >= 2) { return r; }

    r.body = QrGen.create({ canvas }).setStyle(style).setConfig(result).render();
    return r;
}

_types.set("svg", qrDrawSVG);
_types.set("png", async (styleId, body)=>{
    const r = await qrDrawSVG(styleId, body);
    const resvg = new Resvg(r.body);
    r.body = resvg.render().asPng();
    r.mimeType = 'image/png';
    return r;
})

export const qrDraw = async (mime, styleId, config)=>{
    const resolver = _types.get(mime);
    if (resolver) { return resolver(styleId, config); }
    throw new Error(`Mimetype must be '${[..._types.keys()].join("' or '")}'`);
}

export const qrApiResetCounters = async ()=>{
    const now = new Date();
    const isNewWeek = now.getDate() === 1;
    const isNewMonth = now.getDate() === 1;

    const tbl = await db("qrApis");
    return tbl.rows.map(async row=>{
        const r = await row.eval(["countDay", "countWeek", "countMonth"], { byKey:true });
        if ((r.countDay + r.countWeek + r.countMonth) == 0) { return; }
        r.countDay = 0;
        if (isNewWeek) { r.countWeek = 0; }
        if (isNewMonth) { r.countMonth = 0; }
        return row.update(r);
    });
}