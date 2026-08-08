import type { CompanyPitch } from "@/companies/types";
import type { PipelineCompany as SchemaCompany } from "./schema";

export {
  SIZE_BANDS,
  STATUS_ORDER,
  COUNTRY_CODES,
  SOURCE_CHANNELS,
  USD_RATE,
  type PipelineStatus,
  type Posted,
  type Compensation,
  type Hq,
  type Hiring,
  type Source,
  type SizeBand,
  type Application,
  type OutreachTarget,
  type CountryCode,
  type SourceChannel,
} from "./schema";

/** Schema-inferred company with pageDraft narrowed to the real page-copy type. */
export interface PipelineCompany extends Omit<SchemaCompany, "pageDraft"> {
  pageDraft?: CompanyPitch;
}
