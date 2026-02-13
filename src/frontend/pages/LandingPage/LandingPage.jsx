import React, { useEffect, useMemo, useState } from 'react';
import { Block } from "@randajan/jet-react/dom/block";
import { Button, ButtonGroup } from "@mui/material";
import { page } from "@randajan/jet-react/base/page";
import { store } from "@randajan/jet-react/base/store";

import "./LandingPage.scss";
import { QrGenerator } from "./QrGenerator/QrGenerator";
import {say as sayMain} from "../../../arc/qrGen";


store.acceptAll();

export const LandingPage = () => {
    const current = useMemo(_=>store.get("$$qrGen"));
    const onChange = (type, values)=>store.set(`$$qrGen.${type}`, values);

    const say = useMemo(_=>sayMain, []);

    const [lang, setLang] = useState(() => {
        if (typeof navigator !== "undefined" && navigator.language?.toLowerCase().startsWith("cs")) { return "cs"; }
        return "en";
    });

    const resolvedLang = useMemo(() =>{
        return say.setLang((lang === "cs" || lang === "en") ? lang : "en").defaultLang;
    }, [lang]);

    return (
        <Block level={0} className="LandingPage">
            <div className="LandingPage__lang">
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
