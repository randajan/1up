import { page } from "@randajan/jet-react/base/page";
import { usePop } from "@randajan/jet-react/dom/modal";
import { useEffect } from "react";

export const usePagePop = (content, pagePath, upVal="up")=>{
    const [base] = page.use(pagePath);

    const pop = usePop({ children:content, onDown: _ => base.remove(), onUp:_=>base.set("", upVal) });

    useEffect(_ => {
        const onChange = _ => {
            if (base.get() === upVal) { pop.up(); } else { pop.down(); }
        };
        onChange();
        return base.watch("", onChange);
    }, []);

    return pop;
}