/** Comparison operators a condition can use. */
export type Comparator =
  | "eq"
  | "neq"
  | "gt"
  | "gte"
  | "lt"
  | "lte"
  | "in"
  | "contains";

export type ConditionValue = string | number | boolean | (string | number)[];

export interface ConditionNode {
  kind: "condition";
  id: string;
  field: string;
  op: Comparator;
  value: ConditionValue;
}

export type BooleanOp = "and" | "or";

export interface GroupNode {
  kind: "group";
  id: string;
  op: BooleanOp;
  children: TreeNode[];
}

export type TreeNode = ConditionNode | GroupNode;

/** Every tree is rooted in a group. */
export type ConditionTree = GroupNode;

/** Deterministic id source - injected so behavior stays reproducible. */
export type IdGenerator = () => string;

/** Injected clock (ms since epoch) - used only by the history for coalescing. */
export type Clock = () => number;

export interface ValidationIssue {
  nodeId: string;
  code: "empty-group" | "missing-field" | "missing-value" | "duplicate-id";
  message: string;
}
