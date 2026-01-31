import jet from "@randajan/jet-core";

export default {
  id: { isPrimary: true, init: _ => jet.uid() },
  alias: { init:_=>`${String.jet.capitalize(String.jet.rnd(3, 6))} ${String.jet.capitalize(String.jet.rnd(3, 6))}` }, //náhodné jméno 

  isIgnored:{ type:"boolean" },

  // source identity
  ip: {},
  acceptLanguage: {},
  userAgent: {},

  // UA breakdown (string)
  deviceType: {},
  deviceVendor: {},
  deviceModel: {},
  osName: {},
  osVersion: {},
  browserName: {},
  browserVersion: {},

  // geo (if available)
  geoCountry: {},
  geoRegion: {},
  geoCity: {},
  geoLat: { type: "number" },
  geoLon: { type: "number" },
  geoTimezone: {},
  geoAsn: {},
  geoOrg: {},

  createdAt: { type: "datetime", init: _ => new Date() }
};
