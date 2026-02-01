import db from "../db/ramdb.js";
import { addToQueue } from "./queues.js";

export const attachClient = async (e)=>{
    const { record, redirect } = e;
    const { fingerprint:id } = record;
    const clients = await db("webClients");
    e.client = await clients.rows.get(id, false);
    e.isUnique = !e.client;
    if (!e.isUnique) {
        [ e.isBanned, e.isIgnored ] = await e.client.eval(["isBanned", "isIgnored"]);
        return;
    }

    [ e.isBanned, e.isIgnored ] = await redirect.eval(["isBannedDef", "isIgnoredDef"]);

    const { isBanned, isIgnored } = e;
    e.client = await clients.rows.add({...record, id, isBanned, isIgnored });
}

export const logAccess = async (e) => {
    const { record, client, redirect, redirectUrl, isUnique } = e;
    const { method, query, referrer } = record;

    const accs = await db("webAccesses");
    const acc = await accs.rows.add({ client, redirect, redirectUrl, method, query, referrer, isUnique });

    if (redirect) { addToQueue(redirect, acc); }

    return acc;
};