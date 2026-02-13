import { _cornerPathTranslate, _eccsRatio, _lblTransform } from "../consts";


export const calculateRotator = (angle, center, scale) => {
    const rotation = Number(angle) || 0;
    const normalized = ((rotation % 360) + 360) % 360;
    if (!normalized) { return { straight:true, transform: undefined, scale: 1 }; }
    const rad = (Math.PI / 180) * normalized;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    const _scale = 1 / (Math.abs(cos) + Math.abs(sin));
    const centerScaled = center * scale;
    const transform = `translate(${centerScaled} ${centerScaled}) rotate(${normalized}) scale(${_scale}) translate(${-centerScaled} ${-centerScaled})`;
    return { diagonal:true, transform, scale:_scale };
};