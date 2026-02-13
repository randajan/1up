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
    const diagFactor = tfs.angle ? Math.SQRT1_2 : 1;

    const maxWidth = schema.size * scale;
    const maxHeight = margin - lblGap - 1;
    const bound = autosizeText(canvas, lbl, maxWidth, maxHeight, 1+lblScale);

    if (!bound) { return; }

    const fontSize = bound.fontSize;
    const baseShift = schema.sizeHalf * scale + lblGap + bound.height * 0.5;
    
    const shift = baseShift * diagFactor;
    const x = centerX + tfs.x * shift;
    const y = centerY + tfs.y * shift;

    const transform = tfs.angle ? `rotate(${tfs.angle} ${svg.s(x)} ${svg.s(y)})` : undefined;

    svg.text(lbl, formatInline("lbl", style, {
        "text-anchor": "middle",
        transform,
        x,
        y,
        "font-size": fontSize
    }));
};
