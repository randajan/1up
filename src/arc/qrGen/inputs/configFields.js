import { FieldRegistry } from "./class/FieldRegistry";
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
    format:({ computed, issues }, opt = {})=>{
        const { content = {}, collector, collect } = opt;

        const contentType = computed.contentType || "raw";
        const module = getModule(contentType);
        const contentFormatted = module.format(content[contentType] || content, {
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
    contentType: { type: "enum", enm: listModules().map(module => module.id), fb:"raw" }
});
