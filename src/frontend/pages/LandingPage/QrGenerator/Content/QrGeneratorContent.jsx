import React, { useEffect, useMemo, useState } from "react";

import "./QrGeneratorContent.css";

import { createQueue } from "@randajan/queue";

import { configFields, getModule, listModules } from "../../../../../arc/qrGen";
import { QrGeneratorFieldGroups } from "../Field/QrGeneratorFieldGroups";
import { QrGeneratorSection } from "../Section/QrGeneratorSection";
import { createFieldCollector, pushCollectedToGroups } from "../shared/collectFields";

const resolveContentType = (value) => {
    return getModule(value)?.id ?? "raw";
};

export const QrGeneratorContent = ({ say, qrGen, current, onChange }) => {
    const modules = useMemo(() => listModules(), []);
    const [rawConfig, rawByType, format, getActiveType] = useMemo(() => {
        const baseConfig = current?.config ?? current;
        const cfg = (baseConfig && typeof baseConfig === "object")
            ? baseConfig
            : (configFields.format({}).result || {});
        const initialType = resolveContentType(cfg.contentType, modules);
        const rawConfig = { ecc: cfg.ecc, contentType: initialType };
        const contentMap = (cfg && typeof cfg.content === "object" && !Array.isArray(cfg.content)) ? cfg.content : {};
        const rawByType = { ...contentMap };

        if (!rawByType[initialType] || typeof rawByType[initialType] !== "object") {
            rawByType[initialType] = {};
        }

        let activeType = initialType;
        const getActiveType = () => activeType;

        const format = () => {
            const collector = createFieldCollector();
            const configOut = configFields.format(
                rawConfig,
                {
                    content: rawByType,
                    collector,
                    collect: (c, collected) => {
                        pushCollectedToGroups(c, collected, {
                            mapItem: (item) => ({
                                ...item,
                                useDefault: true,
                                section: collected.section || "main"
                            })
                        });
                    }
                }
            );

            const nextType = resolveContentType(configOut?.result?.contentType, modules);
            if (!rawByType[nextType] || typeof rawByType[nextType] !== "object") {
                rawByType[nextType] = {};
            }
            activeType = nextType;

            return {
                collector,
                config: configOut,
                content: {
                    result: configOut?.result?.content,
                    issues: configOut?.issues
                },
                contentType: nextType
            };
        };

        return [rawConfig, rawByType, format, getActiveType];
    }, [current, modules]);

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
                onChange?.("config", {
                    ...rawConfig,
                    content: rawByType
                });
            },
            { softMs: 10, hardMs: 50, pass: "last" }
        );

        const handleFieldChange = (id, value, item) => {
            if (item?.section === "main") {
                if (value === undefined) { delete rawConfig[id]; }
                else { rawConfig[id] = value; }

                if (id === "contentType") {
                    const nextType = resolveContentType(value, modules);
                    if (!rawByType[nextType] || typeof rawByType[nextType] !== "object") {
                        rawByType[nextType] = {};
                    }
                }
            } else {
                const activeType = getActiveType();
                const current = rawByType[activeType] || {};
                if (value === undefined) { delete current[id]; }
                else { current[id] = value; }
                rawByType[activeType] = current;
            }
            enqueueFormat();
        };
        return [handleFieldChange, enqueueFormat];
    }, [format, getActiveType, modules, qrGen]);

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
