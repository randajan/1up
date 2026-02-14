import React, { useEffect, useMemo, useState } from "react";

import "./QrGeneratorContent.css";

import { createQueue } from "@randajan/queue";

import { configFields, getModule } from "../../../../../arc/qrGen";
import { QrGeneratorFieldGroups } from "../Field/QrGeneratorFieldGroups";
import { QrGeneratorSection } from "../Section/QrGeneratorSection";
import { createFieldCollector, pushCollectedToGroups } from "../shared/collectFields";

const resolveContentType = (value) => getModule(value)?.id ?? "raw";

export const QrGeneratorContent = ({ say, qrGen, current, onChange }) => {
    const [rawState, format] = useMemo(() => {
        const baseConfig = current?.config ?? current;
        const cfg = (baseConfig && typeof baseConfig === "object")
            ? baseConfig
            : (configFields.format({}).result || {});
        const initialType = resolveContentType(cfg.contentType);
        const rawState = { ...cfg, contentType: initialType };
        const contentMap = (cfg && typeof cfg.content === "object" && !Array.isArray(cfg.content)) ? cfg.content : null;
        const activeContent = contentMap?.[initialType];
        if (activeContent && typeof activeContent === "object") {
            Object.assign(rawState, activeContent);
        }
        delete rawState.content;

        const format = () => {
            const collector = createFieldCollector();
            const configOut = configFields.format(
                rawState,
                {
                    collector,
                    collect: (c, collected) => {
                        pushCollectedToGroups(c, collected,
                            (item) => ({
                                ...item,
                                useDefault: true,
                                section: collected.section || "main"
                            })
                        );
                    }
                }
            );

            return {
                collector,
                config: configOut,
                contentType: resolveContentType(configOut?.result?.contentType)
            };
        };

        return [rawState, format];
    }, [current]);

    const [formatted, setFormatted] = useState(() => format());

    const [handleFieldChange, enqueueFormat] = useMemo(() => {
        const enqueueFormat = createQueue(
            () => {
                const out = format();
                setFormatted(out);
                if (!qrGen) { return; }
                if (!out?.config?.issues?.critical?.length) {
                    qrGen.setConfig(out.config?.result);
                }
                onChange?.("config", rawState);
            },
            { softMs: 10, hardMs: 50, pass: "last" }
        );

        const handleFieldChange = (id, value) => {
            if (value === undefined) { delete rawState[id]; }
            else { rawState[id] = value; }
            enqueueFormat();
        };
        return [handleFieldChange, enqueueFormat];
    }, [format, qrGen, rawState]);

    useEffect(() => { enqueueFormat(); }, [enqueueFormat]);

    return (
        <QrGeneratorSection
            title={say?.sayOr("label.input", "Content") || "Content"}
            defaultExpanded
        >
            <QrGeneratorFieldGroups
                groups={formatted?.collector?.groups}
                say={say}
                onFieldChange={handleFieldChange}
                className="QrGenerator__groups--content"
            />
        </QrGeneratorSection>
    );
};
