import env from "@randajan/simple-app/env";
import db from "../db/ramdb";


const { queryKey, default:defaultRedirect } = env.redirect;

export const matchRedirect = async (query)=>{
  const redirectId = query?.[queryKey];
  if (!redirectId) { return; }
  const tbl = await db("webRedirects");
  return tbl.rows(redirectId, false);
}

const fetchRedirectUrl = async (entry, redirect)=>{
  const url = redirect ? redirect("url") : defaultRedirect;
  return url || defaultRedirect || "";
}


export const formatRedirectUrl = async (entry, redirect)=>{
  const url = await fetchRedirectUrl(entry, redirect);
  return (url).trim();
}