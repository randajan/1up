import { FieldRegistry } from "../../reforms";
import { getModule, listModules } from "./content";

const mergeIssues = (target = {}, source = {}) => {
    for (const level in source) {
        if (!source[level]?.length) { continue; }
        if (!target[level]) { target[level] = []; }
        target[level].push(...source[level]);
    }
    return target;
};

export const configFields = new FieldRegistry("config", {
    format:({ input, computed, issues }, opt = {})=>{
        const { collector, collect } = opt;

        const module = getModule(computed.contentType);
        const contentFormatted = module.format(input, {
            ...opt,
            collector,
            collect: collect
                ? (c, collected) => collect(c, { ...collected, section: "content" })
                : undefined
        });

        mergeIssues(issues, contentFormatted.issues);
        computed.content = contentFormatted.result;

        return computed;
    }
});

configFields.defineFields("config", {
    ecc: { type: "enum", enm: ["L", "M", "Q", "H"], fb: "M", req:true },
    size: { type: "number", type: "number", min: 128, max: 8196, fb:1024, step: 1, isBackground:true },
    label: { type: "text", isBackground:true },
    contentType: { type: "enum", enm: listModules().map(module => module.id), fb:"raw" }
});
