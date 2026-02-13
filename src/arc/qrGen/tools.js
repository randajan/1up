import { _levels } from "./consts";


export const capitalize = str => (str[0].toUpperCase() + str.slice(1));
export const camelcase = (...strs) =>{
  let r = "";
  for (const str of strs) {
    if (str == null || str === "") { continue; }
    r += !r ? str : capitalize(str);
  }
  return r;
};

/** Convert numeric (0‑3) or letter (L|M|Q|H) level → letter understood by `qrcode` */
export const formatEcc = (lvl = 1, toLetter=true) => {
  if (_levels.includes(lvl)) { return toLetter ? lvl : _levels.indexOf(lvl); }
  if (lvl >= 0 && lvl < 4) { return toLetter ? _levels[Math.floor(lvl)] : Math.floor(lvl); }
  throw new Error(`QR code 'level' should be a number from 0 to 3 or one of: '${_levels.join("', '")}' got '${lvl}' instead.`);
}

export const isEmpty = value => value == null || value === "";

export const toStr = (v)=>v != null ? String(v).trim() : "";

export const toNum = (n, min, max)=>{
  n = Number(n);
  if (!Number.isFinite(n)) { return; }
  if (min != null) { n = Math.max(min, n); }
  if (max != null) { n = Math.min(max, n); }
  return n;
}

export const createEnum = (oneOf)=>{
  return v=>{
    if (oneOf.includes(v)) { return v; }
  }
}

const _FIX = 1e6;                     // 6 d.p.
export const numFix = n => Math.round(n*_FIX)/_FIX;

export const toMaskType = createEnum(["none", "round", "square"]);
export const toCornerType = createEnum(["arc", "cut", "step"]);

export const createClassFormat = (classes={})=>{
  return cn=>classes?.[cn] ?? cn;
}