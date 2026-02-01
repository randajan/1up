import info from "@randajan/simple-app/info";
import env from "@randajan/simple-app/env";
import createFileDB from "@randajan/file-db";
import path from "path";
//import CryptoJS from "crypto-js";

import { importFiles } from "@randajan/simple-app/fs";
import * as files from "./meta/**";


//rawdata
export const fdb = createFileDB({
    dir:path.join(info.dir.root, `../drive/db`),
    //key:env.dbKey,
    timeout:300000,
    // encrypt:(json, key) => {
    //     if (!key) { return json; }
    //     return CryptoJS.AES.encrypt(json, key).toString(); // výstup je string
    // },
    // decrypt:(raw, key) => {
    //     if (!key) { return raw; }
    //     const bytes = CryptoJS.AES.decrypt(raw, key);
    //     return bytes.toString(CryptoJS.enc.Utf8); // výstup je původní string
    // }
});

//cols
const meta = importFiles( files, {
    prefix:"./meta/",
    suffix:".js",
});


export const dbLoad = async _=>{
    const ents = fdb.link("sysEnts", {}, false);
    let entsData;
    try { entsData = await ents.index(); }
    catch(err) {
        console.error("Database is unreadable");
        return;
    }
    

    const tbls = {};

    for (const entName in meta) {
        const ent = fdb.link(entName, { timeout:60000 }, false);
        const cols = meta[entName];
        await ent.unlock();
        await ent.optimize();
        const rows = _=>ent.map((row, id)=>({...row, id}));

        tbls[entName] = { cols, rows }

        if (entsData && !entsData[entName]) {
            await ents.write(entName, {
                id:entName,
                singular:entName.replace(/s$/, ""),
                plural:entName,
                options:["ADD", "EDIT", "REMOVE"].join("; ")
            });
        }
    }

    return tbls;
}