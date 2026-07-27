import type { CompanyPitch } from "./types";
import { acme } from "./acme";
import { sadaora } from "./sadaora";
import { leaflink } from "./leaflink";
import { fluent } from "./fluent";

export const COMPANIES: Record<string, CompanyPitch> = {
  acme,
  sadaora,
  leaflink,
  fluent,
};

export const PITCH_SLUGS = Object.keys(COMPANIES);
