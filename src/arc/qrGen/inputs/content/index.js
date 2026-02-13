import { importFiles } from "@randajan/simple-app/fs";
import { FieldRegistry } from "./../class/FieldRegistry.js";
import * as modules from "./modules/*.js";

const buildModule = (mDef, id) => {
    if (!id) { throw new Error("ContentModule requires 'id'"); }

    const { define, normalize, format, entitle } = mDef;
    if (typeof format !== "function") { throw new Error(`ContentModule '${id}' requires 'format' function`); }
 
    return new FieldRegistry(id, !entitle ? mDef : {
        define, normalize, 
        format:(values, opt={})=>{
            const body = format(values, opt);
            const title = entitle(values, opt);
            return { body, title };
        }
    });
};


const _modules = new Map(Object.entries(importFiles(modules, {
    prefix:"./modules/",
    suffix:".js",
    trait:buildModule
})));


export const getModule = (id = "raw", throwError=false) =>{
    const m = _modules.get(id);
    if (m) { return m; }
    if (!throwError) { return _modules.get("raw"); }
    throw new Error(`ContentModule '${id}' not found`);
}

export const validModuleId = (id, throwError=false) => {
    return getModule(id, throwError)?.id ?? "raw";
}

export const listModules = () => Array.from(_modules.values());