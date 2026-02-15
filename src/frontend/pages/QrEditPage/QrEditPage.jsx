import React, { useEffect, useMemo, useState } from "react";
import { Block } from "@randajan/jet-react/dom/block";
import { Button, ButtonGroup } from "@mui/material";
import { store } from "@randajan/jet-react/base/store";

import "./QrEditPage.scss";
import { QrGenerator } from "../LandingPage/QrGenerator/QrGenerator";
import { say as sayMain } from "../../../arc/qrGen";

store.acceptAll();

export const QrEditPage = () => {
    const [current, setCurrent] = useState({});
    const onChange = (type, values) => store.set(`$$qrGen.${type}`, values);

    const say = useMemo(() => sayMain, []);
    const [lang, setLang] = useState(() => {
        if (typeof navigator !== "undefined" && navigator.language?.toLowerCase().startsWith("cs")) { return "cs"; }
        return "en";
    });

    const resolvedLang = useMemo(() => {
        return say.setLang((lang === "cs" || lang === "en") ? lang : "en").defaultLang;
    }, [lang, say]);

    useEffect(() => {
        const loadCurrent = () => setCurrent(store.get("$$qrGen") || {});

        if (typeof window !== "undefined" && typeof window.requestIdleCallback === "function") {
            const id = window.requestIdleCallback(loadCurrent, { timeout: 120 });
            return () => window.cancelIdleCallback(id);
        }

        const id = setTimeout(loadCurrent, 16);
        return () => clearTimeout(id);
    }, []);

    return (
        <Block level={0} className="QrEditPage">
            <div className="QrEditPage__lang">
                <ButtonGroup size="small" variant="outlined">
                    <Button
                        variant={resolvedLang === "cs" ? "contained" : "outlined"}
                        onClick={() => setLang("cs")}
                    >
                        {say.sayOr("lang.cs", "cs")}
                    </Button>
                    <Button
                        variant={resolvedLang === "en" ? "contained" : "outlined"}
                        onClick={() => setLang("en")}
                    >
                        {say.sayOr("lang.en", "en")}
                    </Button>
                </ButtonGroup>
            </div>
            <QrGenerator say={say} current={current} onChange={onChange} />
        </Block>
    );
};
