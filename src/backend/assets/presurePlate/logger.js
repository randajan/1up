import db from "../db/ramdb.js";
import { addToQueue } from "./queues.js";

export const logAndStore = async (entry, redirectUrl, redirect) => {
    const { id, method, url, query, referrer } = entry;

    const clients = await db("webClients");
    const isUnique = !await clients.rows.exist(id);
    if (isUnique) { await clients.rows.add(entry); }
    else {
        const c = await clients.rows.get(id);
        if (await c("isIgnored")) { return; }
    }

    const accs = await db("webAccesses");
    const acc = await accs.rows.add({ client:id, redirect, redirectUrl, method, url, query, referrer, isUnique });

    if (redirect) { addToQueue(redirect, acc); }

    return acc;
};