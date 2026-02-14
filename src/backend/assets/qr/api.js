import { Resvg } from "@resvg/resvg-js";
import { getValue } from "../db/sugars";
import { configFields, QrGen } from "../../../arc/qrGen";
import { createCanvas } from "canvas";
import toSVG from "@randajan/js-object-view/svg";

const _types = new Map();
const canvas = createCanvas();

const getStyle = async (styleId)=>getValue("qrStyles", styleId, "style", false);

const qrSerializeDetail = (detail)=>Array.isArray(detail) ? detail.join("|") : detail;
export const qrSerializeIssue = ({ id, code, detail })=>`${id}:${code}${!detail?"":":"+qrSerializeDetail(detail)}`;
export const qrSerializeIssues = (items)=>{
    if (!Array.isArray(items) || items.length === 0) { return ""; }
    return items.map(qrSerializeIssue).join(",");
}

_types.set("svg", async (styleId, config) => {
    if (!config) { throw new Error("Missing config"); }

    const style = await getStyle(styleId);
    if (!style) { throw new Error(`Style not found`); }
    
    const { result, issues } = configFields.format(config);
    const r = {issues };
    r.mimeType = 'image/svg+xml; charset=utf-8';

    if (issues.critical) { r.body = toSVG(issues.critical.map(qrSerializeIssue)); }
    else { r.body = QrGen.create({ canvas }).setStyle(style).setConfig(result).render(); }

    return r;
})

_types.set("png", async (styleId, body)=>{
    const r = await resolveQrSvg(styleId, body);
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
