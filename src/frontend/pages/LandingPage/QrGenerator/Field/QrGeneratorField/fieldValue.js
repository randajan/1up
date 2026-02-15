const _rawInputTypes = new Set(["text", "textarea", "url", "email", "date"]);

const normalizeEnumValue = (value, options) => {
    if (!Array.isArray(options) || options.length === 0) { return ""; }
    if (options.includes(value)) { return value; }
    const num = Number(value);
    if (Number.isFinite(num) && options.includes(num)) { return num; }
    return options[0];
};

export const resolveFieldValue = ({ field, value, rawValue, useDefault, options, rootId, uiType }) => {
    const hasRawValue = rawValue !== undefined && rawValue !== null;
    const useRawForInput = hasRawValue
        && (_rawInputTypes.has(uiType) || (rootId === "number" && uiType !== "range"));
    if (useRawForInput) { return rawValue; }

    if (value !== undefined && value !== null) {
        return rootId === "enum" ? normalizeEnumValue(value, options) : value;
    }

    if (!useDefault) { return rootId === "boolean" ? false : ""; }

    const { min, def } = field;
    if (def !== undefined) { return def; }
    if (rootId === "boolean") { return false; }
    if (rootId === "enum") { return options?.[0]; }
    if (rootId === "number") { return min ?? 0; }
    return "";
};
