import React from "react";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";

import "./QrGeneratorFieldGroups.css";

import { QrGeneratorField } from "./QrGeneratorField";
import { getFieldClass, getGroupLabel } from "../shared/fieldUi";

export const QrGeneratorFieldGroups = ({
    groups,
    say,
    onFieldChange,
    fieldClassResolver,
    className
}) => {
    if (!groups || groups.size === 0) { return null; }
    const classes = ["QrGenerator__groups"];
    if (className) { classes.push(className); }

    return (
        <div className={classes.join(" ")}>
            {Array.from(groups.entries()).map(([group, items]) => (
                <Accordion
                    key={group}
                    className="QrGenerator__groupAccordion QrGenerator__group"
                    data-group={group}
                    defaultExpanded
                >
                    <AccordionSummary
                        className="QrGenerator__groupSummary"
                        expandIcon={<span className="QrGenerator__groupIcon">{">"}</span>}
                    >
                        <div className="QrGenerator__groupTitle">{getGroupLabel(group, say)}</div>
                    </AccordionSummary>
                    <AccordionDetails className="QrGenerator__groupDetails">
                        <div className="QrGenerator__grid">
                        {items.map((item) => {
                            const { field, value, computed } = item;

                            return (
                                <QrGeneratorField
                                    key={field.id}
                                    field={field}
                                    value={value}
                                    rawValue={item.rawValue}
                                    issues={item.issues}
                                    computed={computed}
                                    onChange={item.onChange}
                                    onFieldChange={onFieldChange}
                                    fieldItem={item}
                                    say={say}
                                    className={item.className || fieldClassResolver?.(field, item) || getFieldClass(field)}
                                    useDefault={item.useDefault ?? true}
                                    error={item.error}
                                    helperText={item.helperText}
                                />
                            );
                        })}
                        </div>
                    </AccordionDetails>
                </Accordion>
            ))}
        </div>
    );
};
