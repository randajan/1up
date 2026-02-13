import React, { useEffect, useRef, useState } from "react";
import { TextField } from "@mui/material";

export const NumberField = ({ label, value, onChange, inputProps, error, helperText }) => {
    const external = value == null ? "" : String(value);
    const [draft, setDraft] = useState(external);
    const isFocusedRef = useRef(false);

    useEffect(() => {
        if (!isFocusedRef.current) { setDraft(external); }
    }, [external]);

    return (
        <TextField
            label={label}
            value={draft}
            onFocus={() => { isFocusedRef.current = true; }}
            onBlur={() => { isFocusedRef.current = false; }}
            onChange={ev => {
                const next = ev.target.value;
                setDraft(next);
                onChange(next);
            }}
            size="small"
            fullWidth
            type="number"
            inputProps={inputProps}
            InputLabelProps={{ shrink: true }}
            error={!!error}
            helperText={helperText}
        />
    );
};
