import React from "react";
import { Slider } from "@mui/material";

export const RangeField = ({ label, value, onChange, min, max, step }) => {
    const sliderMin = min ?? 0;
    const sliderMax = max ?? 100;
    const sliderStep = step ?? 1;
    const sliderValue = Number.isFinite(Number(value)) ? Number(value) : sliderMin;

    return (
        <div className="QrGenerator__slider">
            <div className="QrGenerator__sliderLabel">{label}</div>
            <Slider
                value={sliderValue}
                min={sliderMin}
                max={sliderMax}
                step={sliderStep}
                onChange={(_, val) => onChange(Array.isArray(val) ? val[0] : val)}
                valueLabelDisplay="auto"
            />
        </div>
    );
};
