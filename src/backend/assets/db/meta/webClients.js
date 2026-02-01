import jet from "@randajan/jet-core";

export default {
  id: { isPrimary: true, init: _ => jet.uid() },

  createdAt: { type: "datetime", init: _ => new Date() },
  alias: { init:_=>`${String.jet.capitalize(String.jet.rnd(3, 6))} ${String.jet.capitalize(String.jet.rnd(3, 6))}` }, //náhodné jméno 
  tags:{ separator:"; " },

  isIgnored:{ type:"boolean" },
  isBanned:{ type:"boolean" },

  // source identity
  ip: {},
  userAgent: {},
  acceptLanguage: {},

  // UA breakdown (string)
  osName: {},
  osVersion: {},
  browserName: {},
  browserVersion: {},
  deviceType: {},
  deviceVendor: {},
  deviceModel: {},


  // geo (if available)
  geoCountry: {},
  geoRegion: {},
  geoCity: {},
  geoLat: { type: "number", dec:8 },
  geoLon: { type: "number", dec:8 },
  geoTimezone: {},
  geoAsn: {},
  geoOrg: {},

};
