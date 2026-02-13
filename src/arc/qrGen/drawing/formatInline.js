import { camelcase } from "../tools";

export const formatInline = (namespace, opt, extra={})=>{
    return {
        ...extra,
        class:opt[camelcase(namespace, "class")],
        fill:opt[camelcase(namespace, "fill")],
        stroke:opt[camelcase(namespace, "stroke")],
        "stroke-width":opt[camelcase(namespace, "strokeWidth")],
        opacity:opt[camelcase(namespace, "opacity")],
        filter:opt[camelcase(namespace, "filter")],
    };
}