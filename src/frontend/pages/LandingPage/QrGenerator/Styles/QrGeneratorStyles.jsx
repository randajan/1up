import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

import "./QrGeneratorStyles.css";
import "../Content/QrGeneratorContent.css";

import { createQueue } from "@randajan/queue";
import { styleFields } from "../../../../../arc/qrGen";
import { QrGeneratorFieldGroups } from "../Field/QrGeneratorFieldGroups";
import { QrGeneratorSection } from "../Section/QrGeneratorSection";
import { createFieldCollector, pushCollectedToGroups } from "../shared/collectFields";

export const QrGeneratorStyles = ({ say, qrGen, current, onChange }) => {
    const rawStyle = useMemo(_=>(current ? {...current} : {}), [current]);
    const [ redrawSymbol, setRedrawSymbol ] = useState();

    const formatted = useMemo(() => {
        const collector = createFieldCollector();
        const formatted = styleFields.format(
            rawStyle,
            {
                collector,
                collect: (c, collected) => {
                    pushCollectedToGroups(c, collected, 
                        item => ({
                            ...item,
                            useDefault: true
                        })
                    );
                }
            }
        );
        qrGen?.setStyle(formatted.result);
        if (redrawSymbol) { onChange?.("style", rawStyle); }
        return formatted;
    }, [redrawSymbol, rawStyle, onChange]);

    const handleChange = useMemo(()=>{
        const enqueueFormat = createQueue(
            ()=>setRedrawSymbol(Symbol()),
            { softMs: 10, hardMs: 50, pass: "last" }
        );
        return (id, value) => {
            if (value === undefined) { delete rawStyle[id]; }
            else { rawStyle[id] = value; }
            enqueueFormat();
        }
    }, [rawStyle, qrGen]);

    return (
        <QrGeneratorSection
            title={say?.sayOr("label.styles", "Style") || "Style"}
            defaultExpanded
        >
            <QrGeneratorFieldGroups
                groups={formatted?.collector?.groups}
                say={say}
                onFieldChange={handleChange}
            />
        </QrGeneratorSection>
    );
};
