import { tag } from "./dom";

const escapeXml = (value = "") => String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const _defaultTextAttrs = {
    "font-family": "sans-serif",
    "fill": "currentColor",
    "text-anchor": "middle",
    "dominant-baseline": "middle",
};

export function svgText(text, props = {}) {
    const textProps = { ..._defaultTextAttrs, ...props };
    return tag("text", textProps, escapeXml(text ?? ""));
}
