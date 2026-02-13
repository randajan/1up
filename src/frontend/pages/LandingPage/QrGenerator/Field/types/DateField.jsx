import React from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { format as formatDate, isValid as isValidDate, parseISO } from "date-fns";

export const DateField = ({ label, value, onChange, error, helperText, placeholder, inputProps }) => {
    const parsed = typeof value === "string" ? parseISO(value) : value instanceof Date ? value : null;
    const pickerValue = parsed && isValidDate(parsed) ? parsed : null;

    return (
        <DatePicker
            label={label}
            value={pickerValue}
            onChange={(next) => {
                if (!next || !isValidDate(next)) { onChange(""); }
                else { onChange(formatDate(next, "yyyy-MM-dd")); }
            }}
            slotProps={{
                textField: {
                    size: "small",
                    fullWidth: true,
                    error: !!error,
                    helperText,
                    placeholder,
                    inputProps
                }
            }}
        />
    );
};
