import { _cornerPathTranslate, _eccsRatio, _lblTransform } from "../consts";

import { formatInline } from "./formatInline";
import { autosizeText, measureText } from "./autosizeText";

export const drawLabel = ({ _qr, svg, margin, rotator }) => {
    const { canvas, schema, style, content, label } = _qr;
    const { lblValue, lblScale, lblPos, lblGap } = style;

    const lbl = (label ?? lblValue) || content.title;
    if (lblPos == "none" || !lbl) { return; }

    const centerX = margin + schema.sizeHalf;
    const centerY = margin + schema.sizeHalf;
    const tfs = _lblTransform[lblPos] ?? _lblTransform.B;

    if (tfs.angle && rotator.straight) { return; }

    const scale = tfs.angle ? rotator.scale : 1;
    const gap = (margin - 1) * lblGap;

    const maxWidth = schema.size * scale;
    const maxHeight = (margin - 1) - gap;
    const bound = autosizeText(canvas, lbl, maxWidth, maxHeight, 1+lblScale);

    if (!bound) { return; }

    const baseShift = (schema.sizeHalf + gap + bound.fontSize * 0.5) * scale;
    
    const shift = baseShift * tfs.diag;
    const x = centerX + shift * tfs.x;
    const y = centerY + shift * tfs.y;

    const transform = tfs.angle ? `rotate(${tfs.angle} ${svg.s(x)} ${svg.s(y)})` : undefined;

    svg.text(lbl, formatInline("lbl", style, {
        "text-anchor": "middle",
        transform,
        x,
        y,
        "font-size": bound.fontSize
    }));
};
