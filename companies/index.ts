import type { CompanyPitch } from "./types";
import { acme } from "./acme";
import { sadaora } from "./sadaora";
import { leaflink } from "./leaflink";
import { fluent } from "./fluent";
import { tradeify } from "./tradeify";
import { fixd } from "./fixd";
import { grayswan } from "./grayswan";

export const COMPANIES: Record<string, CompanyPitch> = {
  acme,
  sadaora,
  leaflink,
  fluent,
  tradeify,
  fixd,
  grayswan,
};

export const PITCH_SLUGS = Object.keys(COMPANIES);
