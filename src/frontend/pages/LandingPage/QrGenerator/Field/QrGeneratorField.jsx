import React from "react";

import "./QrGeneratorField.css";

import { BooleanField } from "./types/BooleanField";
import { ColorField } from "./types/ColorField";
import { DateField } from "./types/DateField";
import { EnumField } from "./types/EnumField";
import { FileField } from "./types/FileField";
import { NumberField } from "./types/NumberField";
import { RangeField } from "./types/RangeField";
import { TextFieldControl } from "./types/TextField";
import { formatIssue } from "../shared/fieldUi";

const normalizeEnumValue = (value, options) => {
    if (!Array.isArray(options) || options.length === 0) { return ""; }
    if (options.includes(value)) { return value; }
    const num = Number(value);
    if (Number.isFinite(num) && options.includes(num)) { return num; }
    return options[0];
};

const resolveValue = (field, value, rawValue, useDefault, options, rootId, uiType) => {
    const hasRawValue = rawValue !== undefined && rawValue !== null;
    const useRawForInput = hasRawValue && (
        uiType === "text"
        || uiType === "textarea"
        || uiType === "url"
        || uiType === "email"
        || uiType === "date"
        || (rootId === "number" && uiType !== "range")
    );
    if (useRawForInput) { return rawValue; }

    if (value !== undefined && value !== null) {
        if (rootId === "enum") { return normalizeEnumValue(value, options); }
        return value;
    }
    const { min, def } = field;
    if (useDefault) {
        if (def !== undefined) { return def; }
        if (rootId === "boolean") { return false; }
        if (rootId === "enum") { return options?.[0]; }
        if (rootId === "number") { return min ?? 0; }
    }
    if (rootId === "boolean") { return false; }
    return "";
};

const resolveTypeId = (field) => {
    if (!field) { return "text"; }
    if (typeof field.type === "string") { return field.type; }
    return field.type.root.id || field.type.id || "text";
};

const resolveUiType = (field, rootId) => {
    const subtype = field?.subtype;
    const supported = ["textarea", "date", "color", "file", "url", "email", "range"];
    if (subtype && supported.includes(subtype)) { return subtype; }
    return rootId;
};

const _issuePriority = { minor: 1, major: 2, critical: 3 };

const resolveIssue = (issues, rawValue) => {
    if (!Array.isArray(issues) || issues.length === 0) { return null; }
    const touched = rawValue !== undefined;
    let best = null;
    let bestRank = 0;
    for (const issue of issues) {
        if (!issue?.level) { continue; }
        if (issue.level !== "critical" && !touched) { continue; }
        const rank = _issuePriority[issue.level] || 0;
        if (rank > bestRank) {
            best = issue;
            bestRank = rank;
        }
    }
    return best;
};

const _uiTypeFields = {
    date: DateField,
    boolean: BooleanField,
    enum: EnumField,
    range: RangeField,
    number: NumberField,
    color: ColorField,
    file: FileField,
    text: TextFieldControl,
    email: TextFieldControl,
    url: TextFieldControl,
    textarea: TextFieldControl
};

export const QrGeneratorField = ({
    field,
    value,
    rawValue,
    issues,
    computed,
    onChange,
    onFieldChange,
    fieldItem,
    say,
    className,
    error,
    helperText,
    useDefault = false
}) => {
    
    const { id, enm, min, max, step, placeholder } = field;
    const rootId = resolveTypeId(field);
    const uiType = resolveUiType(field, rootId);
    const resolvedEnm = typeof enm === "function" ? enm(computed ?? {}) : enm;
    const options = Array.isArray(resolvedEnm) ? resolvedEnm : [];
    const resolved = resolveValue(field, value, rawValue, useDefault, options, rootId, uiType);
    const label = say?.sayOr(`field.${id}.label`, id) || id;
    const emitChange = (next) => {
        if (typeof onChange === "function") {
            onChange(next);
            return;
        }
        onFieldChange?.(id, next, fieldItem);
    };

    const inputProps = {};
    if (min != null) { inputProps.min = min; }
    if (max != null) { inputProps[rootId === "text" ? "maxLength" : "max"] = max; }
    if (step != null) { inputProps.step = step; }

    const multiline = uiType === "textarea";
    const issue = resolveIssue(issues, rawValue);
    const issueLevel = issue?.level;
    const issueText = issue ? formatIssue(issue, say) : "";
    const resolvedHelper = (helperText !== undefined && helperText !== null)
        ? helperText
        : (issueText ? <span className={`QrGenerator__helper QrGenerator__helper--${issueLevel || "minor"}`}>{issueText}</span> : helperText);
    const resolvedError = (error !== undefined && error !== null) ? error : issueLevel === "critical";

    const fieldType = uiType === "email" ? "email" : (uiType === "url" ? "url" : "text");
    const baseProps = {
        label,
        value: resolved,
        onChange: emitChange,
        error: resolvedError,
        helperText: resolvedHelper,
        placeholder,
        inputProps,
        field,
        options,
        min,
        max,
        step,
        accept: field.accept,
        type: fieldType,
        multiline,
        say
    };

    const TypeField = _uiTypeFields[uiType] || TextFieldControl;

    return (
        <div key={id} className={className}>
            <TypeField {...baseProps} />
        </div>
    );
};
