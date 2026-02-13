import { _eccsRatio } from "../consts";
import { toNum } from "../tools";

const createEmptyMask = (size) => {
  const mask = () => true;
  mask.size = 0;
  mask.center = size / 2;
  return mask;
};

const createSquareMask = (size, ratio = 0.2) => {
  let logoSide = Math.floor(size * ratio);
  if (logoSide < 1) { return createEmptyMask(size); }
  if (logoSide % 2 === 0) { logoSide -= 1; }
  if (logoSide < 1) { logoSide = 1; }

  const start = (size - logoSide) >> 1;
  const end = start + logoSide - 1;

  const mask = (x, y) => x < start || x > end || y < start || y > end;
  mask.size = logoSide;
  mask.center = (start + end + 1) / 2;
  return mask;
};

const createRoundMask = (size, ratio = 0.2) => {
  let diameter = Math.floor(size * ratio);
  if (diameter < 1) { return createEmptyMask(size); }
  if (diameter % 2 === 0) { diameter -= 1; }
  if (diameter < 1) { diameter = 1; }

  const radius = diameter / 2;
  const center = (size - 1) / 2;
  const r2 = radius * radius;

  const mask = (x, y) => {
    const dx = x - center;
    const dy = y - center;
    return (dx * dx + dy * dy) > r2;
  };

  mask.size = diameter;
  mask.center = size / 2;
  return mask;
};

export const calculateMask = (_qr, type, size) => {
  const { schema, ecc } = _qr;
  const ratio = _eccsRatio[ecc] * (toNum(size, 0, 1) ?? 0.8);


  if (ratio > 0) {
    if (type === "circle") { return createRoundMask(schema.size, ratio); }
    if (type === "square") { return createSquareMask(schema.size, ratio); }
  }

  return createEmptyMask(schema.size);
};
