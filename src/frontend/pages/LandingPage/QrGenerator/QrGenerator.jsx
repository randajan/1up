import React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

import "./QrGenerator.css";

import { useQrGen } from "./hooks/useQrGen";
import { QrGeneratorContent } from "./Content/QrGeneratorContent";
import { QrGeneratorPreview } from "./Preview/QrGeneratorPreview";
import { QrGeneratorStyles } from "./Styles/QrGeneratorStyles";

export const QrGenerator = ({ say, current, onChange }) => {
    const [ref, qrGen] = useQrGen();

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <div className="QrGenerator">
                <div className="QrGenerator__panel QrGenerator__panel--form">
                    <QrGeneratorContent say={say} qrGen={qrGen} current={current?.config} onChange={onChange} />
                    <QrGeneratorStyles say={say} qrGen={qrGen} current={current?.style} onChange={onChange} />
                </div>
                <QrGeneratorPreview say={say} previewRef={ref} qrGen={qrGen} />
            </div>
        </LocalizationProvider>
    );
};
