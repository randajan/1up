
import be, { app } from "@randajan/simple-app/be/koa";
import info from "@randajan/simple-app/info";
import jet from "@randajan/jet-core";
import serve from "koa-static";
import send from "koa-send";

app.proxy = true;

app.use(serve(info.dir.fe));

app.use(async (ctx, next) => {
    await next();
    if (ctx.status !== 404) { return; }
    await send(ctx, "./index.html", { root: info.dir.fe });
});

process.on("uncaughtException", err => {
    console.warn("Uncaught!!!");
    console.error(err);
});