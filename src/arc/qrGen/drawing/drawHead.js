import { _cornerPathTranslate, _eccsRatio, _lblTransform } from "../consts";

import { buildCssSelector } from "./svg/css";

export const drawHead = ({ _qr, svg }) => {
    const { style } = _qr;
    const {
        id,
        defs,
        midClass, midCss,
        lblClass, lblCss,
        bgClass, bgCss,
        bitsClass, bitsCss,
        eyesClass, eyesCss,
        pupilsClass, pupilsCss,
    } = style;

    svg.defs(defs);

    svg.cssWrap(buildCssSelector(id, bgClass), bgCss);
    svg.cssWrap(buildCssSelector(id, bitsClass), bitsCss);
    svg.cssWrap(buildCssSelector(id, eyesClass), eyesCss);
    svg.cssWrap(buildCssSelector(id, pupilsClass), pupilsCss);
    svg.cssWrap(buildCssSelector(id, midClass), midCss);
    svg.cssWrap(buildCssSelector(id, lblClass), lblCss);

}
