import { _cornerPathTranslate, _eccsRatio, _lblTransform } from "../consts";

import { SVGCanvas } from "./svg";
import { calculateMask } from "./calculateMask";
import { calculateRotator } from "./calculateRotator";

import { drawMidImage } from "./drawImage";
import { drawLabel } from "./drawLabel";
import { drawBody } from "./drawBody";
import { drawHead } from "./drawHead";

export const drawQRCanvas = _qr => {
    const { style, schema, size:outputSize } = _qr;
    const {
        id, defs, css,
        rotation, padding,
        midMaskType, midMaskSize,
    } = style;

    

    const margin = Math.ceil(schema.size * padding);
    const viewSize = schema.size + margin * 2;
    const realSize = outputSize ?? style.size ?? viewSize;
    const scale = Math.round(style.size/schema.size);
    const rotator = calculateRotator(rotation, viewSize / 2, scale);
    const mask = calculateMask(_qr, midMaskType, midMaskSize);

    const svg = new SVGCanvas({
        id, css, defs, scale,
        width: realSize/scale, height: realSize/scale,
        viewWidth: viewSize, viewHeight: viewSize,
    });

    const ctx = { _qr, svg, viewSize, mask, margin, rotator };

    drawHead(ctx);
    drawBody(ctx);
    drawLabel(ctx);
    drawMidImage(ctx);

    return svg;
}
