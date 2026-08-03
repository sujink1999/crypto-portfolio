import type {
  ConditionNode,
  ConditionTree,
  GroupNode,
  IdGenerator,
  TreeNode,
  ValidationIssue,
} from "./types";

/**
 * Every operation returns a new tree; untouched branches are shared by
 * reference. The caller's tree is never mutated.
 */

export function createTree(idGen: IdGenerator): ConditionTree {
  return { kind: "group", id: idGen(), op: "and", children: [] };
}

export function findNode(root: TreeNode, id: string): TreeNode | null {
  if (root.id === id) return root;
  if (root.kind !== "group") return null;
  for (const child of root.children) {
    const hit = findNode(child, id);
    if (hit) return hit;
  }
  return null;
}

export function findParent(root: GroupNode, id: string): GroupNode | null {
  for (const child of root.children) {
    if (child.id === id) return root;
    if (child.kind === "group") {
      const hit = findParent(child, id);
      if (hit) return hit;
    }
  }
  return null;
}

/** Rebuild the spine from root to `groupId`, applying `fn` to that group. */
function mapGroup(
  node: GroupNode,
  groupId: string,
  fn: (g: GroupNode) => GroupNode,
): GroupNode {
  if (node.id === groupId) return fn(node);
  let changed = false;
  const children = node.children.map((child) => {
    if (child.kind !== "group") return child;
    const next = mapGroup(child, groupId, fn);
    if (next !== child) changed = true;
    return next;
  });
  return changed ? { ...node, children } : node;
}

export function addNode(
  tree: ConditionTree,
  parentId: string,
  node: TreeNode,
  index?: number,
): ConditionTree {
  return mapGroup(tree, parentId, (g) => {
    const at = index === undefined ? g.children.length : Math.max(0, Math.min(index, g.children.length));
    const children = [...g.children.slice(0, at), node, ...g.children.slice(at)];
    return { ...g, children };
  });
}

export function removeNode(tree: ConditionTree, id: string): ConditionTree {
  const parent = findParent(tree, id);
  if (!parent) return tree;
  return mapGroup(tree, parent.id, (g) => ({
    ...g,
    children: g.children.filter((c) => c.id !== id),
  }));
}

export function updateCondition(
  tree: ConditionTree,
  id: string,
  patch: Partial<Omit<ConditionNode, "kind" | "id">>,
): ConditionTree {
  const parent = findParent(tree, id);
  if (!parent) return tree;
  return mapGroup(tree, parent.id, (g) => ({
    ...g,
    children: g.children.map((c) =>
      c.id === id && c.kind === "condition" ? { ...c, ...patch } : c,
    ),
  }));
}

export function setGroupOp(
  tree: ConditionTree,
  id: string,
  op: GroupNode["op"],
): ConditionTree {
  return mapGroup(tree, id, (g) => (g.op === op ? g : { ...g, op }));
}

/** Deep-copy a subtree with fresh ids, and insert it after the original. */
export function duplicateNode(
  tree: ConditionTree,
  id: string,
  idGen: IdGenerator,
): ConditionTree {
  const source = findNode(tree, id);
  const parent = findParent(tree, id);
  if (!source || !parent) return tree;
  const clone = reissueIds(source, idGen);
  const index = parent.children.findIndex((c) => c.id === id);
  return addNode(tree, parent.id, clone, index + 1);
}

function reissueIds(node: TreeNode, idGen: IdGenerator): TreeNode {
  if (node.kind === "condition") return { ...node, id: idGen() };
  return {
    ...node,
    id: idGen(),
    children: node.children.map((c) => reissueIds(c, idGen)),
  };
}

/** Move a node under a new parent at `index`. No-op if it would create a cycle. */
export function moveNode(
  tree: ConditionTree,
  id: string,
  newParentId: string,
  index: number,
): ConditionTree {
  const node = findNode(tree, id);
  const target = findNode(tree, newParentId);
  if (!node || !target || target.kind !== "group") return tree;
  if (node.kind === "group" && findNode(node, newParentId)) return tree;
  if (id === newParentId) return tree;
  const without = removeNode(tree, id);
  const next = addNode(without, newParentId, node, index);
  // If the target vanished with the removal (shouldn't happen, but stay safe):
  return findNode(next, id) ? next : tree;
}

/** Wrap the given sibling nodes in a new group where the first one stood. */
export function groupNodes(
  tree: ConditionTree,
  ids: string[],
  op: GroupNode["op"],
  idGen: IdGenerator,
): ConditionTree {
  if (ids.length === 0) return tree;
  const parent = findParent(tree, ids[0]);
  if (!parent) return tree;
  const set = new Set(ids);
  if (!ids.every((i) => parent.children.some((c) => c.id === i))) return tree;
  const wrapped = parent.children.filter((c) => set.has(c.id));
  const group: GroupNode = { kind: "group", id: idGen(), op, children: wrapped };
  const at = parent.children.findIndex((c) => set.has(c.id));
  return mapGroup(tree, parent.id, (g) => {
    const rest = g.children.filter((c) => !set.has(c.id));
    return { ...g, children: [...rest.slice(0, at), group, ...rest.slice(at)] };
  });
}

/**
 * Canonical form: drop empty non-root groups, inline single-child groups,
 * and flatten child groups whose op matches their parent. Applied bottom-up
 * until stable.
 */
export function normalize(tree: ConditionTree): ConditionTree {
  let next = normalizeGroup(tree);
  // Hoist a lone group child into the root so the root stays the real top level.
  while (next.children.length === 1 && next.children[0].kind === "group") {
    const only = next.children[0];
    next = { ...next, op: only.op, children: only.children };
  }
  return next === tree ? tree : normalize(next);
}

function normalizeGroup(g: GroupNode): GroupNode {
  let changed = false;
  const children: TreeNode[] = [];
  for (const child of g.children) {
    if (child.kind !== "group") {
      children.push(child);
      continue;
    }
    const norm = normalizeGroup(child);
    if (norm !== child) changed = true;
    if (norm.children.length === 0) {
      changed = true;
    } else if (norm.children.length === 1) {
      children.push(norm.children[0]);
      changed = true;
    } else if (norm.op === g.op) {
      children.push(...norm.children);
      changed = true;
    } else {
      children.push(norm);
    }
  }
  return changed ? { ...g, children } : g;
}

export function validate(tree: ConditionTree): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const seen = new Set<string>();
  const walk = (node: TreeNode, isRoot: boolean) => {
    if (seen.has(node.id)) {
      issues.push({
        nodeId: node.id,
        code: "duplicate-id",
        message: `Duplicate id "${node.id}"`,
      });
    }
    seen.add(node.id);
    if (node.kind === "group") {
      if (node.children.length === 0 && !isRoot) {
        issues.push({
          nodeId: node.id,
          code: "empty-group",
          message: "Group has no conditions",
        });
      }
      node.children.forEach((c) => walk(c, false));
      return;
    }
    if (!node.field.trim()) {
      issues.push({
        nodeId: node.id,
        code: "missing-field",
        message: "Condition has no field",
      });
    }
    const emptyValue =
      node.value === "" || (Array.isArray(node.value) && node.value.length === 0);
    if (emptyValue) {
      issues.push({
        nodeId: node.id,
        code: "missing-value",
        message: "Condition has no value",
      });
    }
  };
  walk(tree, true);
  return issues;
}
