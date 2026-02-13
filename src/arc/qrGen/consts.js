export const _eccsRatio = { L: 0.25, M: 0.30, Q: 0.35, H: 0.40 };
export const _levels = Object.keys(_eccsRatio);

export const _cornersAttrs = ["radius", "type", "steps"];
export const _cornersSides = ["TL", "TR", "BL", "BR"];
export const _cornersZones = ["outer", "inner"];

export const _cornerPathTranslate = {
    "ul": "TR", "rd": "TR",
    "lu": "BL", "dr": "BL",
    "ur": "TL", "ld": "TL",
    "ru": "BR", "dl": "BR",
}


export const _lblTransform = {
    "T": { angle: 0, x: 0, y: -1 },
    "B": { angle: 0, x: 0, y: 1 },
    "TL": { angle: -45, x: -1, y: -1 },
    "TR": { angle: 45, x: 1, y: -1 },
    "BR": { angle: -45, x: 1, y: 1 },
    "BL": { angle: 45, x: -1, y: 1 },
};
