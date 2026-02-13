import { _cornerPathTranslate, _eccsRatio, _lblTransform } from "../consts";
import { formatInline } from "./formatInline";


const toSvgId = (value, fallback = "myQr") => {
    const clean = String(value ?? "").replace(/[^A-Za-z0-9_-]/g, "_");
    return clean || fallback;
};


export const drawMidImage = ({ _qr, svg, mask, margin, rotator }) => {
    const { schema, style } = _qr;
    const { id, midMaskType, midImg, midImgSize, midImgX, midImgY, midImgInject, midSvgDefs, midSvgHref } = style;

    if (!midImg || midMaskType === "none" || !mask.size) { return; }
    if (midImgInject && midSvgDefs) { svg.defs(midSvgDefs); }
    
    const midCircleClipId = (midMaskType === "circle" && !midImgInject) ? `${toSvgId(id)}_midCircleClip` : "";
    if (midCircleClipId) {
        svg.defs(`<clipPath id="${midCircleClipId}" clipPathUnits="objectBoundingBox"><circle cx="0.5" cy="0.5" r="0.5"/></clipPath>`);
    }

    const midAttrs = formatInline("mid", style);
    const imgScale = Number.isFinite(midImgSize) ? midImgSize : 1;
    const imgSize = mask.size * 0.9 * imgScale * rotator.scale;
    const offsetX = (Number.isFinite(midImgX) ? midImgX : 0) * imgSize;
    const offsetY = (Number.isFinite(midImgY) ? midImgY : 0) * imgSize;
    const center = margin + (Number.isFinite(mask.center) ? mask.center : (schema.size / 2));
    const imgPos = center - (imgSize / 2);

    if (midImgInject && midSvgHref) {
        svg.use(midSvgHref, imgPos + offsetX, imgPos + offsetY, imgSize, imgSize, {
            ...midAttrs,
            preserveAspectRatio: "xMidYMid meet"
        });
        return;
    }

    const imageAttrs = midCircleClipId
        ? { "clip-path": `url(#${midCircleClipId})` }
        : {};
        
    svg.image(imgPos + offsetX, imgPos + offsetY, imgSize, imgSize, {
        ...midAttrs,
        ...imageAttrs,
        href: midImg,
        preserveAspectRatio: "xMidYMid meet"
    });
};