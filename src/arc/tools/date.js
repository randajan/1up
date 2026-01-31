import { isValid } from "date-fns";
import { getTimezoneOffset } from "date-fns-tz";

import jet from "@randajan/jet-core";

const _msList = [
    { unit: "d", factor: 86400000 },
    { unit: "h", factor: 3600000 },
    { unit: "m", factor: 60000 },
    { unit: "s", factor: 1000 }
];

const alignTimezone = (dir, date, timezone = "Europe/Prague") => {
    if (!isValid(date)) { return; }
    const ms = date.getTime();
    const tzoffset = getTimezoneOffset(timezone, date);
    return new Date(ms + (dir ? tzoffset : -tzoffset));
}

export const addTimezone = (date, timezone = "Europe/Prague") => alignTimezone(true, date, timezone);
export const subTimezone = (date, timezone = "Europe/Prague") => alignTimezone(false, date, timezone);

export const toInterval = (dateFrom, dateTo) => {
    const start = new Date(dateFrom || null);
    const end = Date.jet.create(dateTo);

    if (isNaN(start)) { throw Error("Invalid dateFrom"); }
    if (isNaN(end)) { throw Error("Invalid dateTo"); }

    return jet.prop.solid.all({}, { start, end: new Date(end.getTime() - 1) });
}


export const msSec = sec => sec * 1000;
export const msMin = min => msSec(min * 60);
export const msHour = hour => msMin(hour * 60);
export const msDay = day => msHour(day * 24);

export const formatMs = (ms, units = "dhms", decimal=0, zero=false) => {
    const r = [];

    for (const { unit, factor } of _msList) {
        if (!units.includes(unit)) { continue; }
        const value = ms / factor;
        ms %= factor;
        r.push({ toString:function() {
            const isLast = r[r.length-1] === this;
            const check = Math.floor(isLast ? Math.pow(10, decimal) * value : value);
            if (!zero && check <= 0) { return ""; }
            return value.toFixed(isLast ? decimal : 0) + unit + " ";
        } });
    };

    return r.join("").trim();
}