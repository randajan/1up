const _supportedSubtypes = new Set(["textarea", "date", "color", "file", "url", "email", "range"]);

export const getFieldTypeId = (field) => {
    if (!field) { return "text"; }
    if (typeof field.type === "string") { return field.type; }
    return field.type?.root?.id || field.type?.id || "text";
};

export const getFieldUiType = (field, rootId = getFieldTypeId(field)) => {
    const subtype = field?.subtype;
    if (subtype && _supportedSubtypes.has(subtype)) { return subtype; }
    return rootId;
};

export const getFieldClass = (field) => {
    const type = getFieldTypeId(field);
    const uiType = getFieldUiType(field, type);
    const id = String(field?.id || "").toLowerCase();

    const classes = ["QrGenerator__field", `QrGenerator__field--${type}`];
    if (uiType === "textarea" || uiType === "file" || uiType === "range") { classes.push("QrGenerator__field--wide"); }
    if (id.includes("corner")) { classes.push("QrGenerator__field--corner"); }
    return classes.join(" ");
};

export const getGroupLabel = (group, say) => {
    const key = `group.${group}.label`;
    return say?.sayOr(key, group) || group;
};

const formatDetailValue = (value, say) => {
    if (value == null) { return ""; }
    if (Array.isArray(value)) {
        const items = value.map((item) => {
            const key = `enum.${item}`;
            return say?.sayOr(key, String(item)) || String(item);
        });
        const label = say?.sayOr("issue.allowed", "Allowed") || "Allowed";
        return `${label}: ${items.join(", ")}`;
    }
    return String(value);
};

export const formatIssue = (issue, say) => {
    if (!issue?.code) { return ""; }
    const key = `error.${issue.code}`;
    const label = say?.sayOr(key, issue.code) || issue.code;
    const detail = formatDetailValue(issue.detail, say);
    return detail ? `${label}: ${detail}` : label;
};
