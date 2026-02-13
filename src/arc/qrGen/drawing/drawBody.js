import { _cornerPathTranslate, _eccsRatio, _lblTransform } from "../consts";

import { camelcase } from "../tools";
import { SVGCanvas } from "./svg";
import { formatInline } from "./formatInline";


const cornerFromNdir = (ndir) => _cornerPathTranslate[ndir] || ndir;

const createCornerKeyResolver = (symmetry, viewSize) => {
    if (symmetry !== "central") { return undefined; }
    const center = viewSize / 2;
    const mirrorX = { TL: "TR", TR: "TL", BL: "BR", BR: "BL" };
    const mirrorY = { TL: "BL", BL: "TL", TR: "BR", BR: "TR" };
    return (ndir, x, y) => {
        let key = cornerFromNdir(ndir);
        const isRight = x >= center;
        const isBottom = y >= center;
        if (isRight) { key = mirrorX[key] || key; }
        if (isBottom) { key = mirrorY[key] || key; }
        return key;
    };
};

const initPath = (namespace, canvas, margin, style, transform, getCornerKey) => {
    const nsc = camelcase(namespace, "corner");
    const attrs = formatInline(namespace, style);
    const group = canvas.group(attrs);

    return group.path({
        getCornerKey,
        getCornerRadius: (d, s) => style[`${nsc}${s}${cornerFromNdir(d)}Radius`],
        getCornerType: (d, s) => style[`${nsc}${s}${cornerFromNdir(d)}Type`],
        getCornerSteps: (d, s) => style[`${nsc}${s}${cornerFromNdir(d)}Steps`],
        startX: margin,
        startY: margin,
        attrs: { transform }
    });
}


export const drawBody = ({ _qr, svg, mask, margin, rotator, viewSize }) => {
    const { schema, style } = _qr;
    const { bits, eyes } = schema;
    const {
        symmetry,
        bgOn,
        bitsForm,
        eyesOn,
        pupilsOn,
        eyesForm,
        pupilsForm
    } = style;

    const getRelative = (bit, side) => bits.getRelative(bit.x, bit.y, side, mask);
    const getCornerKey = createCornerKeyResolver(symmetry, viewSize);

    const drawed = new Set();
    const markAsDrawed = b => {
        drawed.add(b);
        const r = getRelative(b, "r");
        if (r) { markAsDrawed(r); }
    }

    if (bgOn) { svg.background(formatInline("bg", style)); }

    const bitsPath = initPath("bits", svg, margin, style, rotator.transform, getCornerKey);
    const eyesPath = !eyesOn ? bitsPath : initPath("eyes", svg, margin, style, rotator.transform, getCornerKey);
    const pupilsPath = !pupilsOn ? bitsPath : initPath("pupils", svg, margin, style, rotator.transform, getCornerKey);

    if (bits) {
        for (const [k, bit] of bits.entries()) {
            if (drawed.has(bit)) { continue; }
            if (!mask(bit.x, bit.y)) { continue; }
            bit.draw(bitsForm, bitsPath, getRelative, markAsDrawed);
        }
    }

    if (eyes) {
        for (const eye of eyes) {
            eye.draw(eyesForm, eyesPath);
            eye.pupil.draw(pupilsForm, pupilsPath);
        }
    }

}
