import env from "@randajan/simple-app/env";

const { user, pass } = env.odata.auth;


export const odataAuth = async (ctx, next) => {
    if (!user || !pass) { return next(); }
    const auth = ctx.get("authorization") || "";
    if (!auth.startsWith("Basic ")) {
        ctx.set("WWW-Authenticate", 'Basic realm="OData"');
        ctx.status = 401;
        return;
    }
    const token = auth.slice(6).trim();
    const expected = Buffer.from(`${user}:${pass}`).toString("base64");
    if (token !== expected) {
        ctx.set("WWW-Authenticate", 'Basic realm="OData"');
        ctx.status = 401;
        return;
    }
    return next();
};