import React from "react";
import { FormControlLabel, Switch as MuiSwitch } from "@mui/material";

import "./BooleanField.scss";

export const BooleanField = ({ label, value, onChange }) => (
    <FormControlLabel
        label={label}
        control={
            <MuiSwitch
                checked={!!value}
                onChange={(_, checked) => onChange(checked)}
            />
        }
    />
);
