import jet from "@randajan/jet-core";
import ramdb from "@randajan/ram-db/async";
import { dbLoad, fdb } from "./files";


export const db = ramdb("main", dbLoad, {
    displayDefault:1, //every column is in the default accessible due to odata-server
    maxAge:0, //data never expires
    maxAgeError:5000 //errors will be cleared after 5 seconds
});

db.on("afterSave", async (action, row)=>{
    const { table, saved } = row;
    const body = action === "remove" ? undefined : saved.raws;
    delete body.id;
    await fdb.get(table.name).write(saved.key, body);
});

export default db;
