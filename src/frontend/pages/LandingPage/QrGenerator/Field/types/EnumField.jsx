import React from "react";
import { MenuItem, TextField } from "@mui/material";

export const EnumField = ({ label, value, onChange, options, field, say, error, helperText }) => (
    <TextField
        select
        label={label}
        value={value ?? ""}
        onChange={ev => onChange(ev.target.value)}
        size="small"
        fullWidth
        error={!!error}
        helperText={helperText}
    >
        {options.map(opt => {
            const vk = String(opt);
            const optionLabel = say.sayOr(`field.${field.id}.enum.${vk}`, "") || say?.sayOr(`enum.${vk}`, vk);
            return (
                <MenuItem key={opt} value={opt}>
                    {optionLabel}
                </MenuItem>
            );
        })}
    </TextField>
);
