import { normalize } from "./ops";
import type { ConditionTree, TreeNode } from "./types";

/**
 * Stable serialized format, versioned so stored audiences survive engine
 * changes. Ids are structural (not persisted) - two trees that mean the same
 * thing serialize identically after normalization.
 */

export interface SerializedCondition {
  t: "c";
  field: string;
  op: string;
  value: unknown;
}

export interface SerializedGroup {
  t: "g";
  op: "and" | "or";
  children: SerializedNode[];
}

export type SerializedNode = SerializedCondition | SerializedGroup;

export interface SerializedTree {
  v: 1;
  root: SerializedGroup;
}

export function serialize(tree: ConditionTree): SerializedTree {
  return { v: 1, root: toWire(normalize(tree)) as SerializedGroup };
}

function toWire(node: TreeNode): SerializedNode {
  if (node.kind === "condition") {
    return { t: "c", field: node.field, op: node.op, value: node.value };
  }
  return { t: "g", op: node.op, children: node.children.map(toWire) };
}

/** Deterministic string form - safe to diff, hash, or store. */
export function serializeToString(tree: ConditionTree): string {
  return JSON.stringify(serialize(tree));
}

/** Human-readable form, e.g. `country is US and (plan is Scale or seats > 10)`. */
export function toExpression(tree: ConditionTree): string {
  const norm = normalize(tree);
  if (norm.children.length === 0) return "(no conditions)";
  return expr(norm, true);
}

const OP_LABEL: Record<string, string> = {
  eq: "is",
  neq: "is not",
  gt: ">",
  gte: ">=",
  lt: "<",
  lte: "<=",
  in: "in",
  contains: "contains",
};

function expr(node: TreeNode, isRoot = false): string {
  if (node.kind === "condition") {
    const value = Array.isArray(node.value)
      ? `[${node.value.join(", ")}]`
      : String(node.value);
    return `${node.field || "?"} ${OP_LABEL[node.op] ?? node.op} ${value}`;
  }
  const inner = node.children.map((c) => expr(c)).join(` ${node.op} `);
  return isRoot ? inner : `(${inner})`;
}
