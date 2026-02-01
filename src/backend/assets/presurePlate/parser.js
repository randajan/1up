import { UAParser } from "ua-parser-js";
import geoip from "geoip-lite";
import crypto from "crypto";

const norm = (value) => String(value || "").trim().toLowerCase();

const getClientIp = (ctx) => {
  const forwarded = ctx.headers["x-forwarded-for"];
  if (Array.isArray(forwarded)) {
    return forwarded[0];
  }
  if (typeof forwarded === "string") {
    const candidate = forwarded.split(",")[0]?.trim();
    if (candidate) {
      return candidate;
    }
  }

  return norm(ctx.request?.ip || ctx.req?.socket?.remoteAddress);
};

const getUa = (ctx) => {
  const ua = norm(ctx.headers["user-agent"]);
  const r = { userAgent:ua };
  const uaDetails = new UAParser(ua).getResult();
  if (!uaDetails) { return r; }

  const device = uaDetails.device || {};
  const os = uaDetails.os || {};
  const browser = uaDetails.browser || {};

  r.deviceType = norm(device.type);
  r.deviceVendor = norm(device.vendor);
  r.deviceModel = norm(device.model);
  r.osName = norm(os.name);
  r.osVersion = norm(os.version);
  r.browserName = norm(browser.name);
  r.browserVersion = norm(browser.version);

  return r;
};

const getGeo = (ip) => {
  if (!ip) { return {}; }
  const geo = geoip.lookup(ip);
  if (!geo) { return {}; }

  return {
    geoCountry: norm(geo.country),
    geoRegion: norm(geo.region),
    geoCity: norm(geo.city),
    geoLat: geo.ll?.[0],
    geoLon: geo.ll?.[1],
    geoTimezone: geo.timezone,
    geoAsn: geo.asn,
    geoOrg: geo.org,
  };
};


const buildFingerprint = (n) => {
  const parts = [
    n.group,
    n.ip,
    n.acceptLanguage,
    n.ua,
    n.deviceType,
    n.deviceVendor,
    n.deviceModel,
    n.osName,
    n.osVersion,
    n.browserName,
    n.browserVersion,
    n.geoCountry,
    n.geoRegion,
    n.geoCity,
  ];

  const raw = parts.join("|");
  return crypto.createHash("sha256").update(raw).digest("hex");
};

const withFingerprint = (rec)=>{
  rec.fingerprint = buildFingerprint(rec);
  return rec;
}

export const buildRecord = (ctx, group) => {
  const { method, query, headers } = ctx;

  const ip = getClientIp(ctx);
  const referrer = headers["referer"] || headers["referrer"];
  const acceptLanguage = norm(headers["accept-language"]);

  const ua = getUa(ctx);
  const geo = getGeo(ip);

  return withFingerprint({
    ip,
    method,
    query,
    referrer,
    acceptLanguage,
    group,
    ...ua,
    ...geo,
  });
};
