import type { CompanyPitch } from "./types";
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
import { fieldguide } from "./fieldguide";
import { deeptune } from "./deeptune";
import { atria } from "./atria";
import { railway } from "./railway";
import { kadoa } from "./kadoa";
import { colonist } from "./colonist";
import { zeitlabs } from "./zeitlabs";
import { albert } from "./albert";
import { clickup } from "./clickup";
import { deepnote } from "./deepnote";
import { elevenlabs } from "./elevenlabs";
import { respan } from "./respan";
import { seeq } from "./seeq";
import { supabase } from "./supabase";
import { stacksync } from "./stacksync";
import { deeply } from "./deeply";
import { numeral } from "./numeral";
import { reveleer } from "./reveleer";

export const COMPANIES: Record<string, CompanyPitch> = {
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
  fieldguide,
  deeptune,
  atria,
  railway,
  kadoa,
  colonist,
  zeitlabs,
  albert,
  clickup,
  deepnote,
  elevenlabs,
  respan,
  seeq,
  supabase,
  stacksync,
  deeply,
  numeral,
  reveleer,
};

export const PITCH_SLUGS = Object.keys(COMPANIES);
