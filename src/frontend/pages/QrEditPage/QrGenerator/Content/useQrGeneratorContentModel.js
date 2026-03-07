import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createQueue } from "@randajan/queue";

import { configForm, getContentForm } from "@randajan/1up-api/4server";
import { createFieldCollector, pushCollectedToGroups } from "../shared/collectFields";


const resolveContentType = (value) => getContentForm(value)?.id ?? "url";

const createEmptyFormatted = () => ({
    collector: createFieldCollector(),
    config: undefined,
    contentType: "url"
});

const createInitialRawState = (current) => {
    const baseConfig = current?.config ?? current;
    const cfg = (baseConfig && typeof baseConfig === "object") ? baseConfig : { contentType: "url" };
    const initialType = resolveContentType(cfg.contentType);
    const rawState = { ...cfg, contentType: initialType };
    const contentMap = (cfg && typeof cfg.content === "object" && !Array.isArray(cfg.content)) ? cfg.content : null;
    const activeContent = contentMap?.[initialType];

    if (activeContent && typeof activeContent === "object") {
        Object.assign(rawState, activeContent);
    }
    delete rawState.content;
    return rawState;
};

const formatContentState = (rawState) => {
    const collector = createFieldCollector();
    const config = configForm.format(rawState, {
        isEditor:true,
        collector,
        collect: (c, collected) => {
            pushCollectedToGroups(c, collected, (item) => ({
                ...item,
                useDefault: true,
                section: collected.tag || "main"
            }));
        }
    });

    return { collector, config, contentType: resolveContentType(config?.result?.contentType) };
};

const scheduleInitialFormat = (run) => {
    if (typeof window !== "undefined" && typeof window.requestIdleCallback === "function") {
        const id = window.requestIdleCallback(run, { timeout: 120 });
        return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(run, 16);
    return () => clearTimeout(id);
};

export const useQrGeneratorContentModel = ({ current, qrGen, onChange }) => {
    const rawStateRef = useRef(createInitialRawState(current));
    const [formatted, setFormatted] = useState(() => createEmptyFormatted());

    const formatAndApply = useCallback(() => {
        const out = formatContentState(rawStateRef.current);
        setFormatted(out);
        if (!(out?.config?.issues.maxLevel >= 2)) {
            qrGen?.setConfig(out.config.result);
        }
        onChange?.("config", rawStateRef.current);
    }, [onChange, qrGen]);

    const enqueueFormat = useMemo(() => createQueue(formatAndApply, {
        softMs: 10,
        hardMs: 50,
        pass: "last"
    }), [formatAndApply]);

    const handleFieldChange = useCallback((id, value) => {
        const rawState = rawStateRef.current;
        if (value === undefined) { delete rawState[id]; }
        else { rawState[id] = value; }
        enqueueFormat();
    }, [enqueueFormat]);

    useEffect(() => {
        rawStateRef.current = createInitialRawState(current);
        return scheduleInitialFormat(enqueueFormat);
    }, [current, enqueueFormat]);

    return { formatted, handleFieldChange };
};
