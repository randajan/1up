import db from "../db/ramdb";
import createQueue from "@randajan/queue";
import { sendNotification } from "../notifications";


const _queues = new Map();

const newQueue = async (redirect) => {
    if (!redirect) { return; }

    let [softMs, hardMs, minSize, maxSize] = await redirect.eval(["qSoftMs", "qHardMs", "qMinSize", "qMaxSize"]);
    softMs = softMs ?? hardMs;

    if (!softMs && !hardMs && !minSize && !maxSize) { return; }
    return createQueue((accsArgs)=>sendNotification(redirect, accsArgs.map(([a])=>a)), { softMs, hardMs, maxSize, minSize });
}

const getQueue = (redirect) => _queues.get(redirect?.key);

const removeQueue = (redirect) =>{
    const queue = getQueue(redirect);
    if (!queue) { return; }
    queue.flush();
    _queues.delete(redirect?.key);
}

const setQueue = async (redirect) =>{
    removeQueue(redirect);
    _queues.set(redirect?.key, await newQueue(redirect));
}

const setQueues = async _ => {
    const tbl = await db("webRedirects");
    return tbl.rows.map(setQueue);
}

export const addToQueue = (redirect, access) => {
    const queue = getQueue(redirect);
    if (queue) { queue(access); }
}

//on change reshedule or deshedule
db.on("afterSave", (action, row) => {
    const { table } = row;
    if (table.name !== "webRedirects") { return; }
    if (action === "remove") { removeQueue(row); }
    else { setQueue(row); }
});

db.on("afterReset", setQueues);

//shedule current jobs
setTimeout(setQueues);

