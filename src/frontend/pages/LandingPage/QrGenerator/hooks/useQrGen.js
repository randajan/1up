import { useEffect, useMemo, useRef } from "react";

import { QrGen } from "../../../../../arc/qrGen/class/QRGen";

export const useQrGen = (onChange) => {
    const ref = useRef(null);
    const onChangeRef = useRef(onChange);

    useEffect(() => { onChangeRef.current = onChange; }, [onChange]);

    const qrGen = useMemo(() => {
        const canvas = document.createElement("canvas");
        const handleChange = (g) => {
            if (!ref.current) { return; }
            ref.current.innerHTML = g.render();
            onChangeRef.current?.(g);
        };
        return new QrGen({ onChange:handleChange, canvas });
    }, []);

    return [ref, qrGen];
};
