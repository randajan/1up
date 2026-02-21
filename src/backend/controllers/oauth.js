import { oauth2Google } from "../assets/oauth";

export default router => {

    router.get("/google/user", ctx => {
        const redirect = oauth2Google.getInitAuthURL(ctx.query);
        ctx.redirect(redirect);
    });

    router.get("/google/exit", async ctx => {
        const redirect = await oauth2Google.getExitAuthURL(ctx.query, ctx);
        ctx.redirect(redirect);
    });

}