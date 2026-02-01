import toHtml from "@randajan/js-object-view";
import env from "@randajan/simple-app/env";

const { debugTo } = env.nodemailer;

const buildClient = async (client)=>{
  return client.eval([
    "createdAt", "alias", "ip", "userAgent",
    "osName", "osVersion", "browserName", "browserVersion",
    "deviceType", "deviceVendor", "deviceModel",
    "geoCity", "geoRegion", "geoCountry",
  ], {byKey:true});
}

const buildAccesses = async (accs)=>{
  const newClients = [];

  const accesses = await Promise.all(accs.map(async acc=>{
    const a = await acc.eval([
      "createdAt", "client", "isUnique",
      "method", "query", "referrer", "redirectUrl"
    ], { byKey:true });

    if (a.isUnique) { newClients.push(await buildClient(a.client)); }

    a.client = await a.client?.("alias");

    return a;
  }));

  return [newClients, accesses];
}

export const buildNotificationEmail = async (redirect, accs) => {

  let [ id, url, to ] = await redirect.eval(["id", "url", "owner.email"]);
  if (debugTo) { to = debugTo; }
  if (!to) { return; }

  const [ newClients, accesses ] = await buildAccesses(accs);

  const style = [
    "body{font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.4;color:#111;margin:0;padding:16px;background:#fff}",
    "h1{margin:0 0 10px 0;font-size:18px}",
    "h2{margin:16px 0 8px 0;font-size:15px;letter-spacing:.2px}",
    ".View{margin:0 0 12px 0}",
    "table{border-collapse:collapse;width:100%;max-width:100%}",
    "th,td{border-top:1px solid #d5d5d5;border-right:1px solid #efefef;border-bottom:1px solid #d5d5d5;border-left:1px solid #efefef !important;padding:6px 8px;vertical-align:top}",
    "th{background:#f5f5f5;text-align:left;font-weight:600}",
    "td.ListKey{width:160px;background:#fafafa;font-weight:600}",
    ".ListItem,.TableCell{border-top-color:#d5d5d5 !important;border-bottom-color:#d5d5d5 !important;border-left-color:#efefef !important;border-right-color:#efefef !important}",
    "a{color:#1a73e8;text-decoration:none}",
    "a:hover{text-decoration:underline}"
  ].join("");

  const html = [
    "<html><head>",
    `<style>${style}</style>`,
    "</head><body>",
    "<h1>Redirect</h1>",
    toHtml({id, url}),
    ...(newClients.length ? ["<h2>New Clients</h2>", toHtml(newClients)] : []),
    "<h2>Accesses</h2>",
    toHtml(accesses),
    "</body></html>",
  ].join("");

  const subject = `1up report ${newClients.length}/${accesses.length}`;

  return { to, subject, html };
};
