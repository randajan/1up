import { _cornerPathTranslate, _eccsRatio, _lblTransform } from "../consts";
import { formatInline } from "./formatInline";


const toSvgId = (value, fallback = "myQr") => {
    const clean = String(value ?? "").replace(/[^A-Za-z0-9_-]/g, "_");
    return clean || fallback;
};

const getMidBox = ({ _qr, mask, margin, rotator }) => {
    const { schema, style } = _qr;
    const { midImgSize, midImgX, midImgY } = style;
    const imgScale = Number.isFinite(midImgSize) ? midImgSize : 1;
    const imgSize = mask.size * 0.9 * imgScale * rotator.scale;
    const offsetX = (Number.isFinite(midImgX) ? midImgX : 0) * imgSize;
    const offsetY = (Number.isFinite(midImgY) ? midImgY : 0) * imgSize;
    const center = margin + (Number.isFinite(mask.center) ? mask.center : (schema.size / 2));
    const imgPos = center - (imgSize / 2);
    return { imgSize, offsetX, offsetY, imgPos };
};

const drawInjectedMidImage = (ctx) => {
    const { _qr, svg, mask, margin, rotator } = ctx;
    const { style } = _qr;
    const { midMaskType, midImgInject, midSvgDefs, midSvgHref } = style;

    if (midMaskType === "none" || !mask.size) { return false; }
    if (!midImgInject || !midSvgHref) { return false; }

    if (midSvgDefs) { svg.defs(midSvgDefs); }

    const { imgSize, offsetX, offsetY, imgPos } = getMidBox({ _qr, mask, margin, rotator });
    const midAttrs = formatInline("mid", style, { preserveAspectRatio: "xMidYMid meet" });

    svg.use(midSvgHref, imgPos + offsetX, imgPos + offsetY, imgSize, imgSize, midAttrs);

    return true;
};

const drawClassicMidImage = (ctx) => {
    const { _qr, svg, mask, margin, rotator } = ctx;
    const { style } = _qr;
    const { id, midMaskType, midImg } = style;

    if (!midImg || midMaskType === "none" || !mask.size) { return false; }

    const midCircleClipId = (midMaskType === "circle") ? `${toSvgId(id)}_midCircleClip` : "";
    if (midCircleClipId) {
        svg.defs(`<clipPath id="${midCircleClipId}" clipPathUnits="objectBoundingBox"><circle cx="0.5" cy="0.5" r="0.5"/></clipPath>`);
    }

    const { imgSize, offsetX, offsetY, imgPos } = getMidBox({ _qr, mask, margin, rotator });
    const imageAttrs = midCircleClipId ? { "clip-path": `url(#${midCircleClipId})` } : {};

    const midAttrs = formatInline("mid", style, {
        ...imageAttrs,
        href: midImg,
        preserveAspectRatio: "xMidYMid meet"
    });

    svg.image(imgPos + offsetX, imgPos + offsetY, imgSize, imgSize, midAttrs);

    return true;
};

export const drawMidImage = (ctx) => (drawInjectedMidImage(ctx) || drawClassicMidImage(ctx));
