import type { CompanyPitch } from "./types";
import { acme } from "./acme";
import { sadaora } from "./sadaora";
import { leaflink } from "./leaflink";
import { fluent } from "./fluent";
import { tradeify } from "./tradeify";
import { fixd } from "./fixd";
import { grayswan } from "./grayswan";
import { material } from "./material";
import { pax } from "./pax";
import { broccoli } from "./broccoli";
import { tailor } from "./tailor";
import { mem0 } from "./mem0";

export const COMPANIES: Record<string, CompanyPitch> = {
  acme,
  sadaora,
  leaflink,
  fluent,
  tradeify,
  fixd,
  grayswan,
  material,
  broccoli,
  pax,
  tailor,
  mem0,
};

export const PITCH_SLUGS = Object.keys(COMPANIES);
