import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createQueue } from "@randajan/queue";

import { styleFields } from "../../../../../arc/qrGen";
import { createFieldCollector, pushCollectedToGroups } from "../shared/collectFields";

const createEmptyFormatted = () => ({
    collector: createFieldCollector(),
    result: {}
});

const createRawStyle = (current) => {
    if (!current || typeof current !== "object") { return {}; }
    return { ...current };
};

const formatStyleState = (rawStyle) => {
    const collector = createFieldCollector();
    return styleFields.format(rawStyle, {
        collector,
        collect: (c, collected) => {
            pushCollectedToGroups(c, collected, (item) => ({
                ...item,
                useDefault: true
            }));
        }
    });
};

const scheduleInitialFormat = (run) => {
    if (typeof window !== "undefined" && typeof window.requestIdleCallback === "function") {
        const id = window.requestIdleCallback(run, { timeout: 120 });
        return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(run, 16);
    return () => clearTimeout(id);
};

export const useQrGeneratorStylesModel = ({ current, qrGen, onChange }) => {
    const rawStyleRef = useRef(createRawStyle(current));
    const emitChangeRef = useRef(false);
    const [formatted, setFormatted] = useState(() => createEmptyFormatted());

    const formatAndApply = useCallback(() => {
        const out = formatStyleState(rawStyleRef.current);
        setFormatted(out);
        qrGen?.setStyle(out.result);
        if (emitChangeRef.current) {
            onChange?.("style", rawStyleRef.current);
        }
    }, [onChange, qrGen]);

    const enqueueFormat = useMemo(() => createQueue(formatAndApply, {
        softMs: 10,
        hardMs: 50,
        pass: "last"
    }), [formatAndApply]);

    const handleFieldChange = useCallback((id, value) => {
        emitChangeRef.current = true;
        const rawStyle = rawStyleRef.current;
        if (value === undefined) { delete rawStyle[id]; }
        else { rawStyle[id] = value; }
        enqueueFormat();
    }, [enqueueFormat]);

    useEffect(() => {
        rawStyleRef.current = createRawStyle(current);
        emitChangeRef.current = false;
        return scheduleInitialFormat(enqueueFormat);
    }, [current, enqueueFormat]);

    return { formatted, handleFieldChange };
};
