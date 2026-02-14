import { camelcase } from "../tools";
import { _cornersAttrs, _cornersSides, _cornersZones, _lblTransform } from "../consts";
import { FieldRegistry } from "../../reforms";
import { buildSvgInjection } from "./svgInject";

const isDiagonalRotation = (rotation) => {
    const value = Number(rotation);
    if (!Number.isFinite(value)) { return false; }
    const normalized = ((value % 360) + 360) % 360;
    return (normalized % 90) !== 0;
};

const getLblPosEnum = ({ rotation }) => {
    if (!isDiagonalRotation(rotation)) { return ["none", "T", "B"]; }
    return ["none", ...Object.keys(_lblTransform)];
}

export const styleFields = new FieldRegistry("style", {
    format: ({ computed:style, issues }, { sanitizeSvgForInjection }) => {
        const sanitize = (typeof sanitizeSvgForInjection === "function")
            ? sanitizeSvgForInjection
            : (svg => svg);

        if (style?.midImgInject && style?.midImg) {
            const injected = buildSvgInjection(style.midImg, sanitize);
            if (injected) {
                style.midSvgDefs = injected.defs;
                style.midSvgHref = injected.href;
            }
        }

        return style;
    },
    define: sf => {
        const _subtypes = sf.defineSubtypes({
            "form": { type: "enum", enm: ["merge", "split", "solid"] },
            "strokeWidth": { type: "range", fb: 0 },
            "opacity": { type: "range", fb: 1 },
            "corner": { type: "enum", enm: ["basic", "zoned", "sided", "all"] },
            "cornerRadius": { type: "range", ndef: 0 },
            "cornerType": { type: "enum", enm: ["arc", "cut", "step"], ndef: "arc" },
            "cornerSteps": { type: "enum", enm: [1, 2, 3], ndef: 1 },
            "white": { type: "color", fb: "#FFFFFF" },
            "gray": { type: "color", fb: "#444444" },
            "black": { type: "color", fb: "#000000" }
        });

        const defineCorners = (prefixId, parentFallback) => {
            const out = {};

            //master switch eyesOn / pupilsOn
            const swm = !parentFallback ? null : camelcase(prefixId, "on");

            //main switch
            const sw = camelcase(prefixId, "corner");
            out[sw] = { type: "corner", showIf: s => (s.mode !== "modeBasic" && (!swm || s[swm])), isLogic: true };

            for (const s of _cornersSides) { //TL, TR, BL, BR
                for (const z of _cornersZones) { //inner outer
                    for (const a of _cornersAttrs) { //radius, type, steps
                        const isRadius = a === "radius";
                        const type = camelcase("corner", a);

                        const based = camelcase(prefixId, type);
                        const basedRadius = isRadius ? null : camelcase(prefixId, "corner", "radius");
                        out[based] = { type, showIf: s => (s[sw] === "basic" && (!swm || s[swm]) && (!basedRadius || s[basedRadius] > 0)), isLogic: true };

                        const zoned = camelcase(prefixId, "corner", z, a);
                        const zonedRadius = isRadius ? null : camelcase(prefixId, "corner", z, "radius");
                        out[zoned] = { type, showIf: s => (s[sw] === "zoned" && (!swm || s[swm]) && (!zonedRadius || s[zonedRadius] > 0)), isLogic: true };

                        const sided = camelcase(prefixId, "corner", s, a);
                        const sidedRadius = isRadius ? null : camelcase(prefixId, "corner", s, "radius");
                        out[sided] = { type, showIf: s => (s[sw] === "sided" && (!swm || s[swm]) && (!sidedRadius || s[sidedRadius] > 0)), isLogic: true };

                        const all = camelcase(prefixId, "corner", z, s, a);
                        const allRadius = isRadius ? null : camelcase(prefixId, "corner", z, s, "radius");
                        out[all] = {
                            type,
                            showIf: s => (s[sw] === "all" && (!swm || s[swm]) && (!allRadius || s[allRadius] > 0)),
                            fb: s => {
                                switch (s[sw]) {
                                    case "basic": return s[based];
                                    case "zoned": return s[zoned];
                                    case "sided": return s[sided];
                                    case "all": return _subtypes[type].ndef;
                                }
                            }
                        };
                    }
                }
            }

            return out;
        }

        sf.defineFields("main", {
            "mode": { type: "enum", enm: ["modeBasic", "modeAdvanced", "modeExpert"], fb: "modeBasic", isLogic: true },
            "id": { type: "text", fb: "myQr", showIf: ({ mode }) => (mode === "modeExpert") },
            "symmetry": { type: "enum", enm: ["uniform", "central"], fb: "uniform", showIf: ({ mode }) => (mode !== "modeBasic") },
            "size": { type: "number", min: 128, max: 8196, step: 1, fb: 1024 },
            "padding": { type: "range", fb: 0.2, showIf: ({ mode }) => (mode !== "modeBasic") },
            "rotation": { type: "range", min: 0, max: 360, step: 45, fb: 0 },
            "defs": { type: "textarea", showIf: ({ mode }) => (mode === "modeExpert") },
            "css": { type: "textarea", showIf: ({ mode }) => (mode === "modeExpert") },
        });

        sf.defineFields("bg", {
            "bgOn": { type: "boolean" },
            "bgClass": { type: "text", fb: "bg", showIf: ({ bgOn, mode }) => (bgOn && mode === "modeExpert") },
            "bgFill": { type: "white", showIf: ({ bgOn }) => (bgOn) },
            "bgStrokeWidth": { type: "strokeWidth", showIf: ({ bgOn }) => (bgOn) },
            "bgStroke": { type: "black", showIf: ({ bgStrokeWidth, bgOn }) => (bgOn && bgStrokeWidth > 0) },
            "bgOpacity": { type: "opacity", showIf: ({ bgOn, mode }) => (bgOn && mode !== "modeBasic") },
            "bgFilter": { type: "textarea", showIf: ({ bgOn, mode }) => (bgOn && mode === "modeExpert") },
            "bgCss": { type: "textarea", showIf: ({ bgOn, mode }) => (bgOn && mode === "modeExpert") }
        });

        sf.defineFields("bits", {
            "bitsClass": { type: "text", fb: "bits", showIf: ({ mode }) => (mode === "modeExpert") },
            "bitsForm": { type: "form" },
            "bitsFill": { type: "black" },
            "bitsStrokeWidth": { type: "strokeWidth" },
            "bitsStroke": { type: "gray", showIf: ({ bitsStrokeWidth }) => (bitsStrokeWidth > 0) },
            "bitsOpacity": { type: "opacity", showIf: ({ mode }) => (mode !== "modeBasic") },
            "bitsFilter": { type: "textarea", showIf: ({ mode }) => (mode === "modeExpert") },
            "bitsCss": { type: "textarea", showIf: ({ mode }) => (mode === "modeExpert") },
            ...defineCorners("bits")
        });

        sf.defineFields("mid", {
            "midMaskType": { type: "enum", enm: ["none", "square", "circle"] },
            "midMaskSize": { type: "range", fb: 0.8, step: 0.1, showIf: ({ mode, midMaskType }) => (mode !== "modeBasic" && midMaskType !== "none") },
            "midImg": { type: "file", accept: "image/*", showIf: ({ midMaskType }) => (midMaskType !== "none") },
            "midImgInject": { type: "boolean", showIf: ({ mode, midMaskType, midImg }) => (mode === "modeExpert" && midMaskType !== "none" && !!midImg) },
            "midImgSize": { type: "range", min: 0.5, max: 2, step: 0.05, fb: 1, showIf: ({ midMaskType, midImg }) => (midMaskType !== "none" && !!midImg) },
            "midImgX": { type: "range", min: -0.5, max: 0.5, step: 0.01, fb: 0, showIf: ({ midMaskType, midImg }) => (midMaskType !== "none" && !!midImg) },
            "midImgY": { type: "range", min: -0.5, max: 0.5, step: 0.01, fb: 0, showIf: ({ midMaskType, midImg }) => (midMaskType !== "none" && !!midImg) },
            "midClass": { type: "text", fb: "mid", showIf: ({ midImg, mode }) => (!!midImg && mode === "modeExpert") },
            "midFill": { type: "color", showIf: ({ midImg, midImgInject }) => (!!midImg && !!midImgInject), fb: ({ bitsFill }) => bitsFill },
            "midStrokeWidth": { type: "strokeWidth", showIf: ({ midImg, midImgInject }) => (!!midImg && !!midImgInject), fb: ({ bitsStrokeWidth }) => bitsStrokeWidth },
            "midStroke": { type: "color", showIf: ({ midImg, midImgInject, midStrokeWidth }) => (!!midImg && !!midImgInject && midStrokeWidth > 0), fb: ({ bitsStroke }) => bitsStroke },
            "midOpacity": { type: "opacity", showIf: ({ midImg }) => (!!midImg), fb: ({ bitsOpacity }) => bitsOpacity },
            "midFilter": { type: "textarea", showIf: ({ midImg, mode }) => (!!midImg && mode === "modeExpert"), fb: ({ bitsFilter }) => bitsFilter },
            "midCss": { type: "textarea", showIf: ({ midImg, mode }) => (!!midImg && mode === "modeExpert") },

        });

        sf.defineFields("lbl", {
            "lblPos": { type: "enum", enm: getLblPosEnum, fb: "none", showIf: ({ padding }) => padding >= 0.1 },
            "lblValue": { type: "text", showIf: ({ lblPos }) => lblPos !== "none" },
            "lblScale":{ type:"range", min:-0.5, max:0.5, step:0.01, fb:0, showIf: ({ lblPos }) => (lblPos !== "none")  },
            "lblGap": { type: "range", min: 0, max: 12, step: 0.1, fb: 1, showIf: ({ lblPos }) => (lblPos !== "none") },
            "lblClass": { type: "text", fb: "lbl", showIf: ({ lblPos, mode }) => (lblPos !== "none" && mode === "modeExpert") },
            "lblFill": { type: "color", fb: ({ bitsFill }) => bitsFill, showIf: ({ lblPos }) => (lblPos !== "none") },
            "lblStrokeWidth": { type: "strokeWidth", fb: ({ bitsStrokeWidth }) => bitsStrokeWidth, showIf: ({ lblPos }) => (lblPos !== "none") },
            "lblStroke": { type: "color", fb: ({ bitsStroke }) => bitsStroke, showIf: ({ lblPos, lblStrokeWidth }) => (lblPos !== "none" && lblStrokeWidth > 0) },
            "lblOpacity": { type: "opacity", fb: ({ bitsOpacity }) => bitsOpacity, showIf: ({ lblPos }) => (lblPos !== "none") },
            "lblFilter": { type: "textarea", fb: ({ bitsFilter }) => bitsFilter, showIf: ({ lblPos, mode }) => (lblPos !== "none" && mode === "modeExpert") },
            "lblCss": { type: "textarea", showIf: ({ lblPos, mode }) => (lblPos !== "none" && mode === "modeExpert") },
        });

        sf.defineFields("eyes", {
            "eyesOn": { type: "boolean" },
            "eyesClass": { type: "text", fb: "eyes", showIf: ({ eyesOn, mode }) => (eyesOn && mode === "modeExpert") },
            "eyesForm": { type: "form", showIf: ({ eyesOn }) => (eyesOn), fb: ({ bitsForm }) => bitsForm },
            "eyesFill": { type: "color", showIf: ({ eyesOn }) => (eyesOn), fb: ({ bitsFill }) => bitsFill },
            "eyesStrokeWidth": { type: "strokeWidth", showIf: ({ eyesOn }) => (eyesOn), fb: ({ bitsStrokeWidth }) => bitsStrokeWidth },
            "eyesStroke": { type: "color", showIf: ({ eyesStrokeWidth, eyesOn }) => (eyesOn && eyesStrokeWidth > 0), fb: ({ bitsStroke }) => bitsStroke },
            "eyesOpacity": { type: "opacity", showIf: ({ eyesOn, mode }) => (eyesOn && mode !== "modeBasic"), fb: ({ bitsOpacity }) => bitsOpacity },
            "eyesFilter": { type: "textarea", showIf: ({ eyesOn, mode }) => (eyesOn && mode === "modeExpert"), fb: ({ bitsFilter }) => bitsFilter },
            "eyesCss": { type: "textarea", showIf: ({ eyesOn, mode }) => (eyesOn && mode === "modeExpert"), fb: ({ bitsCss }) => bitsCss },
            ...defineCorners("eyes", _ => "bits")
        });

        sf.defineFields("pupils", {
            "pupilsOn": { type: "boolean" },
            "pupilsClass": { type: "text", fb: "pupils", showIf: ({ pupilsOn, mode }) => (pupilsOn && mode === "modeExpert") },
            "pupilsForm": { type: "form", showIf: ({ pupilsOn }) => (pupilsOn), fb: ({ pupilsOn, bitsForm, eyesForm }) => (pupilsOn ? eyesForm : bitsForm) },
            "pupilsFill": { type: "color", showIf: ({ pupilsOn }) => (pupilsOn), fb: ({ pupilsOn, bitsFill, eyesFill }) => (pupilsOn ? eyesFill : bitsFill) },
            "pupilsStrokeWidth": { type: "strokeWidth", showIf: ({ pupilsOn }) => (pupilsOn), fb: ({ pupilsOn, bitsStrokeWidth, eyesStrokeWidth }) => (pupilsOn ? eyesStrokeWidth : bitsStrokeWidth) },
            "pupilsStroke": { type: "color", showIf: ({ pupilsStrokeWidth, pupilsOn }) => (pupilsOn && pupilsStrokeWidth > 0), fb: ({ pupilsOn, bitsStroke, eyesStroke }) => (pupilsOn ? eyesStroke : bitsStroke) },
            "pupilsOpacity": { type: "opacity", showIf: ({ pupilsOn, mode }) => (pupilsOn && mode !== "modeBasic"), fb: ({ pupilsOn, bitsOpacity, eyesOpacity }) => (pupilsOn ? eyesOpacity : bitsOpacity) },
            "pupilsFilter": { type: "textarea", showIf: ({ pupilsOn, mode }) => (pupilsOn && mode === "modeExpert"), fb: ({ pupilsOn, bitsFilter, eyesFilter }) => (pupilsOn ? eyesFilter : bitsFilter) },
            "pupilsCss": { type: "textarea", showIf: ({ pupilsOn, mode }) => (pupilsOn && mode === "modeExpert"), fb: ({ pupilsOn, bitsCss, eyesCss }) => pupilsOn ? eyesCss : bitsCss },
            ...defineCorners("pupils", ({ pupilsOn }) => pupilsOn ? "eyes" : "bits")
        });
    }
});
