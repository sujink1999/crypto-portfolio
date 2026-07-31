import type { ComponentType } from "react";

/**
 * Research-stage widget mocks. Each pipeline batch that proposes a custom
 * page widget adds a lightweight mock component here under the key stored
 * in research.widgetConcept.key. Real implementations live in
 * components/pitch once approved and built.
 */
export const WIDGET_MOCKS: Record<string, ComponentType> = {};
