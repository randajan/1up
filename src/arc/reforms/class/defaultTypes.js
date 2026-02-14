import { toNum, toStr } from "../../qrGen/tools.js";
import { FieldType } from "./FieldType.js";

const _defaultTypes = (() => {
    const types = new Map();

    types.set("boolean", new FieldType({
        id: "boolean",
        format: (_field, value) => {
            if (value === "false" || value === "0") { return false; }
            if (value === "true" || value === "1") { return true; }
            return Boolean(value);
        },
        defaults: (opt) => {
            if (opt.fb == null) { opt.fb = false; }
            return opt;
        }
    }));

    types.set("number", new FieldType({
        id: "number",
        format: ({min, max}, value, pushIssue) => {
            if (value === "") { return; }
            let out = Number(value);
            if (!Number.isFinite(out)) {
                pushIssue("invalid", "critical");
                return;
            }

            if (min != null && out < min) {
                pushIssue("min", "major", min);
                out = Math.max(min, out);
            }
            if (max != null && out > max) {
                pushIssue("max", "major", max);
                out = Math.min(max, out);
            }
            return out;
        }
    }));

    types.set("range", types.get("number").createSubType("range", { min:0, max:1, step:0.05 }));

    types.set("enum", new FieldType({
        id: "enum",
        format: (field, value, pushIssue, computed) => {
            const enm = field.enm(computed) || [];
            if (!Array.isArray(enm) || !enm.length) {
                pushIssue("invalid", "major");
                return;
            }

            if (enm.includes(value)) { return value; }

            const num = toNum(value);
            if (num != null && enm.includes(num)) { return num; }
            pushIssue("invalid", "major", [...enm]);
        },
        defaults: (opt) => {
            const { enm } = opt;
            const isArray = Array.isArray(enm);

            if (isArray) { opt.enm = () => enm; }
            if (opt.fb == null) { opt.fb = isArray ? enm[0] : c => (opt.enm(c)?.[0]); }

            return opt;
        }
    }));

    const textType = new FieldType({
        id: "text",
        format: ({ max, min }, value, pushIssue) => {
            let out = toStr(value);

            if (min != null && min.length < min) {
                pushIssue("max", "major", min);
                return;
            }

            if (max != null && out.length > max) {
                pushIssue("max", "major", max);
                out = out.slice(0, field.max);
            }

            if (value !== out) {
                pushIssue("normalized", "minor");
            }

            return out;
        },
        defaults: (opt) => {
            if (opt.max == null) {
                switch (opt.subtype) {
                    case "textarea": opt.max = 12000; break;
                    case "url": opt.max = 2048; break;
                    case "email": opt.max = 320; break;
                    case "date": opt.max = 10; break;
                    case "color": opt.max = 9; break;
                    case "file": break; // data URLs can be very long; do not cap here by default
                    default: opt.max = 255;
                }
            }
            return opt;
        }
    });

    types.set("text", textType);
    types.set("textarea", textType.createSubType("textarea"));
    types.set("date", textType.createSubType("date"));
    types.set("color", textType.createSubType("color"));
    types.set("file", textType.createSubType("file"));

    types.set("url", textType.createSubType("url", {
        format: (_field, value, pushIssue) => {
            try { return new URL(value); } catch(err) {
                pushIssue("invalid", "critical");
            }
        }
    }));

    types.set("email", textType.createSubType("email", {
        format: (_field, value, pushIssue) => {
            if (!value || value.includes("@")) { return value; }
            pushIssue("invalid", "critical");
        }
    }));

    types.set("symbol", textType.createSubType("email", {
        format: (_field, value, pushIssue) => {
            if (!value || /^\d+$/.test(value)) { return value; }
            pushIssue("invalid", "critical");
        }
    }));


    return types;
})();

export const createDefaultFieldTypes = () => new Map(_defaultTypes);

export const getDefaultFieldTypes = () => _defaultTypes;
