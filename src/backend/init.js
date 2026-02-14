
import be, { app } from "@randajan/simple-app/be/koa";
import info from "@randajan/simple-app/info";
import jet from "@randajan/jet-core";
import serve from "koa-static";

app.proxy = true;

app.use(serve(info.dir.fe));


process.on("uncaughtException", err => {
    console.warn("Uncaught!!!");
    console.error(err);
});