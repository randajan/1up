const trim = (value) => (typeof value === "string" ? value.trim() : "");

const normalizeBody = (css="") => {
    const body = css.trim();
    if (!body) { return ""; }
    return body.replace(/;?\s*$/, ";");
};

export const wrapCssSelector = (selector, css) => {
    const body = normalizeBody(css);
    if (!body) { return ""; }
    return `${selector} { ${body} }`;
};

export const joinCssBlocks = (blocks) => {
    return blocks.map(trim).filter(Boolean).join("\n");
};

export const buildCssSelector = (id, className) => {
    const cleanClass = trim(className);
    if (!cleanClass) { return ""; }
    const idSelector = id ? `#${trim(id)} ` : "";
    return `${idSelector}.${cleanClass}`;
};