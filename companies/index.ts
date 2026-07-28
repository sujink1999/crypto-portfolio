import type { CompanyPitch } from "./types";
import { acme } from "./acme";
import { sadaora } from "./sadaora";
import { leaflink } from "./leaflink";
import { fluent } from "./fluent";
import { tradeify } from "./tradeify";

export const COMPANIES: Record<string, CompanyPitch> = {
  acme,
  sadaora,
  leaflink,
  fluent,
  tradeify,
};

export const PITCH_SLUGS = Object.keys(COMPANIES);
