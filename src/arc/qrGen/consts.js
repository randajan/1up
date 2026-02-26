export const _eccsRatio = { L: 0.25, M: 0.30, Q: 0.35, H: 0.40 };

export const _cornerPathTranslate = {
    "ul": "TR", "rd": "TR",
    "lu": "BL", "dr": "BL",
    "ur": "TL", "ld": "TL",
    "ru": "BR", "dl": "BR",
}


export const _lblTransform = {
    "T": { angle: 0, x: 0, y: -1, diag:1 },
    "B": { angle: 0, x: 0, y: 1, diag:1 },
    "TL": { angle: -45, x: -1, y: -1, diag:Math.SQRT1_2 },
    "TR": { angle: 45, x: 1, y: -1, diagn:Math.SQRT1_2 },
    "BR": { angle: -45, x: 1, y: 1, diag:Math.SQRT1_2 },
    "BL": { angle: 45, x: -1, y: 1, diag:Math.SQRT1_2 },
};
