import { timespanToMs, msToHms } from "@randajan/odata-server";
import odataServer from "@randajan/ram-db/odata";
import db from "./ramdb";
import { addTimezone, subTimezone } from "../../../arc/tools/date";


export const odata = odataServer(db, {
    //fakeRemove:"$$remove",
    extender:async (context, config={})=>{

        context.returnVals = !!config.returnVals;
        context.tzWorkaround = !!config.tzWorkaround;
        context.useTimespan = !!config.useTimespan;
        context.auth = context.responder.context.auth;

    },
    typesTable:{
        "duration":"Edm.Int64", // THIS IS ONLY WAY FOR APPSHEET
    },
    converter:{
        "Edm.Int64":(value, method, context)=>{
            if (!context.useTimespan || value == null) { return value; }
            if (method === "toResponse") { return value / 86400000; } //appsheet is inconsistent
            if (method === "toAdapter") { return timespanToMs(value, "duration'", "'"); }
        },
        "Edm.DateTimeOffset":(value, method, context)=>{
            if (!context.tzWorkaround || value == null) { return value; }
            //appsheet timezone bug workaround
            const dt = value instanceof Date ? value : new Date(value);
            if (method === "toResponse") { return addTimezone(dt); }
            else if (method === "toAdapter") { return subTimezone(dt); }
        }
    },
    returnVals:(context)=>context.returnVals,
    filter:async ({ auth, route, returnVals }, tbl, col)=>{
        if (!col) { return true; }
        return col.display > 0;
    }
});


