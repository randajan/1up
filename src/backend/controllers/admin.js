import env from "@randajan/simple-app/env";

export default router => {
    router.get("/", ctx=>{
        ctx.status = 302;
        ctx.set("Location", env.admin.url);
    });
}

