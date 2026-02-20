import env from "@randajan/simple-app/env";
import createPulse from "@randajan/pulse";
import { log } from "@randajan/simple-app/log";
import { qrApiResetCounters } from "../assets/qr/api";
import { fdb } from "../assets/db/files";


const announceNextPulse = p=>{ log("CRON next pulse:", (new Date(Date.now()+p.countdown)).toLocaleString()); }


if (!env.cron?.off) {
    createPulse({
        autoStart:true,
        interval:1000*60*60*24, //one day
        offset:1000*60*60*2, //two in the morning,
        onStart:announceNextPulse,
        onPulse:async (p, { started })=>{
            log("CRON pulse");
            await qrApiResetCounters();
            await fdb.optimize();
        },
        afterPulse:announceNextPulse
    });
}