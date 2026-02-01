import env from "@randajan/simple-app/env";
import db from "../db/ramdb";

export const matchRedirect = async (redirectId)=>{
  if (!redirectId) { return; }
  const tbl = await db("webRedirects");
  return tbl.rows(redirectId, false);
}

const fetchRedirectUrl = async (entry)=>{
  const { redirect } = entry;
  const url = redirect ? await redirect("url") : "";
  return url || "";
}


export const attachRedirectUrl = async (entry)=>{
  const url = await fetchRedirectUrl(entry);
  entry.redirectUrl = (url).trim();
}