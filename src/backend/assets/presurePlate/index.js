import env from "@randajan/simple-app/env";
import { buildEntry } from "./parser.js";
import { formatRedirectUrl, matchRedirect } from "./redirect.js";
import { logAndStore } from "./logger.js";

import toHtml from "@randajan/js-object-view";


export const presurePlate = (skip = () => false) => async (ctx, next) => {
  if (skip(ctx)) { return next(); }

  const entry = buildEntry(ctx);

  const redirect = await matchRedirect(ctx.query);
  const redirectUrl = await formatRedirectUrl(entry, redirect);

  if (!redirectUrl) {
    ctx.status = 404;
    ctx.body = "Not Found";
    return;
  }

  if (!env.redirect.debug) {
    ctx.status = 307;
    ctx.set("Location", redirectUrl);
    logAndStore(entry, redirectUrl, redirect); //no await
  } else {
    ctx.status = 200;
    const acc = await logAndStore(entry, redirectUrl, redirect); //no await
    const dbg = await acc.saved.vals;
    dbg.client = await dbg.client?.saved.vals;
    dbg.redirect = await dbg.redirect?.saved.vals;
    ctx.body = `<html><head></head><body>${await toHtml(dbg)}</body></html>`;


  }
};
