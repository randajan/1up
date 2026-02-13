import React from "react";
import { TextField } from "@mui/material";

export const ColorField = ({ label, value, onChange, error, helperText }) => (
    <TextField
        label={label}
        type="color"
        value={value || "#000000"}
        onChange={ev => onChange(ev.target.value)}
        size="small"
        fullWidth
        InputLabelProps={{ shrink: true }}
        error={!!error}
        helperText={helperText}
    />
);
