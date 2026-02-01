import env from "@randajan/simple-app/env";
import { buildRecord } from "./parser.js";
import { attachRedirectUrl, matchRedirect } from "./redirect.js";
import { attachClient, logAccess } from "./logger.js";

import toHtml from "@randajan/js-object-view";


export const presurePlate = (getKey = ()=>{}) => async (ctx, next) => {
  const rId = getKey(ctx);
  if (!rId) { return next(); }

  const e = {};

  e.redirect = await matchRedirect(rId);
  if (!e.redirect) { return next(); }

  e.record = buildRecord(ctx);

  if (!e.redirect) { ctx.status = 404; return; }
  if (await e.redirect("closedAt")) { ctx.status = 410; return; }

  await attachRedirectUrl(e);
  await attachClient(e);
  
  if (!e.redirectUrl) { e.status = 401; }
  else if (e.isBanned) { e.status = 403; }
  else { e.status = 307; }

  const accProm = e.isIgnored ? null : logAccess(e);

  if (!env.redirect.debug) {
    ctx.status = e.status;
    if (e.status === 307) {
      ctx.body = `<html><script>location.replace("${e.redirectUrl}")</script><body><a href="${e.redirectUrl}">Click here</a></body></html>`;
      ctx.set("Location", e.redirectUrl);
    }
  } else {
    const acc = await accProm;
    e.redirect = await e.redirect?.saved.vals;
    e.client = await e.client?.saved.vals;
    e.access = await acc?.saved.vals;
    ctx.status = 200;
    ctx.body = `<html><head></head><body>${await toHtml(e)}</body></html>`;
  }


};
