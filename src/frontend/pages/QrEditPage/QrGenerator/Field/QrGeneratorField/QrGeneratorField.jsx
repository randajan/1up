import React from "react";

import "./QrGeneratorField.scss";

import { formatIssue, getFieldTypeId } from "../../shared/fieldUi";
import { resolveIssue } from "./fieldIssue";
import { resolveUiField, resolveUiType } from "./fieldTypeMap";
import { resolveFieldValue } from "./fieldValue";

const resolveChangeHandler = ({ id, onChange, onFieldChange, fieldItem }) => (next) => {
    if (typeof onChange === "function") {
        onChange(next);
        return;
    }
    onFieldChange?.(id, next, fieldItem);
};

const resolveInputProps = ({ min, max, step, rootId }) => {
    const inputProps = {};
    if (min != null) { inputProps.min = min; }
    if (max != null) { inputProps[rootId === "text" ? "maxLength" : "max"] = max; }
    if (step != null) { inputProps.step = step; }
    return inputProps;
};

const resolveFieldType = (uiType) => {
    if (uiType === "email") { return "email"; }
    if (uiType === "url") { return "url"; }
    return "text";
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
    const rootId = getFieldTypeId(field);
    const uiType = resolveUiType(field, rootId);
    const resolvedEnm = typeof enm === "function" ? enm(computed ?? {}) : enm;
    const options = Array.isArray(resolvedEnm) ? resolvedEnm : [];
    const resolved = resolveFieldValue({ field, value, rawValue, useDefault, options, rootId, uiType });

    const issue = resolveIssue(issues, rawValue);
    const issueSeverity = issue?.severity;
    const issueText = issue ? formatIssue(issue, say) : "";
    const resolvedHelperText = helperText ?? (
        issueText
            ? <span className={`QrGenerator__helper QrGenerator__helper--${issueSeverity || "minor"}`}>{issueText}</span>
            : helperText
    );

    const UiField = resolveUiField(uiType);
    const baseProps = {
        label: say?.sayOr(`field.${id}.label`, id) || id,
        value: resolved,
        onChange: resolveChangeHandler({ id, onChange, onFieldChange, fieldItem }),
        error: error ?? issueSeverity === "critical",
        helperText: resolvedHelperText,
        placeholder,
        inputProps: resolveInputProps({ min, max, step, rootId }),
        field,
        options,
        min,
        max,
        step,
        accept: field.accept,
        type: resolveFieldType(uiType),
        multiline: uiType === "textarea",
        say
    };

    return (
        <div key={id} className={className}>
            <UiField {...baseProps} />
        </div>
    );
};
