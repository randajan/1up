



const formatAttrs = (props={}) =>{
    let attrs = "";
    for (let [k,v] of Object.entries(props)) {
        if (k === "children") { continue; }
        if (v == null) { continue; }
        attrs += ` ${k}="${v}"`;
    }
    return attrs;
}

const formatChildren = (tagName, children)=>{
    return children ? `>${Array.isArray(children) ? children.join('\n') : children}</${tagName}` : "/";
}

export const tag = (tagName, props, children) => {
    return `<${tagName}${formatAttrs(props)}${formatChildren(tagName, children ?? props.children)}>`;
}