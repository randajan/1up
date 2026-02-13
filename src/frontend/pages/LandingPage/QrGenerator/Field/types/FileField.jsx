import React from "react";
import { TextField } from "@mui/material";

export const FileField = ({ label, onChange, accept, error, helperText }) => (
    <TextField
        label={label}
        type="file"
        size="small"
        fullWidth
        InputLabelProps={{ shrink: true }}
        inputProps={{ accept: accept || "image/*" }}
        onChange={(ev) => {
            const file = ev.target.files?.[0];
            if (!file) {
                onChange(undefined);
                return;
            }
            const reader = new FileReader();
            reader.onload = () => onChange(reader.result || undefined);
            reader.onerror = () => onChange(undefined);
            reader.readAsDataURL(file);
        }}
        error={!!error}
        helperText={helperText}
    />
);
