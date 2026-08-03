import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  addNode,
  createTree,
  duplicateNode,
  findNode,
  groupNodes,
  moveNode,
  normalize,
  removeNode,
  setGroupOp,
  updateCondition,
  validate,
} from "./ops";
import { serializeToString, toExpression } from "./serialize";
import {
  apply,
  canRedo,
  canUndo,
  createHistory,
  redo,
  undo,
} from "./history";
import type { ConditionNode, ConditionTree, GroupNode, IdGenerator } from "./types";

function makeIdGen(prefix = "n"): IdGenerator {
  let i = 0;
  return () => `${prefix}${++i}`;
}

function cond(id: string, field: string, op: ConditionNode["op"], value: ConditionNode["value"]): ConditionNode {
  return { kind: "condition", id, field, op, value };
}

function deepFreeze<T>(obj: T): T {
  Object.freeze(obj);
  for (const value of Object.values(obj as object)) {
    if (value && typeof value === "object" && !Object.isFrozen(value)) deepFreeze(value);
  }
  return obj;
}

/** country is US and (plan is Scale or seats > 10) */
function sampleTree(): ConditionTree {
  return deepFreeze({
    kind: "group",
    id: "root",
    op: "and",
    children: [
      cond("c1", "country", "eq", "US"),
      {
        kind: "group",
        id: "g1",
        op: "or",
        children: [
          cond("c2", "plan", "eq", "Scale"),
          cond("c3", "seats", "gt", 10),
        ],
      },
    ],
  } satisfies ConditionTree);
}

describe("tree operations", () => {
  it("never mutates the caller's tree (all inputs frozen)", () => {
    const tree = sampleTree();
    const idGen = makeIdGen();
    addNode(tree, "g1", cond("c4", "region", "eq", "EU"));
    removeNode(tree, "c2");
    updateCondition(tree, "c1", { value: "CA" });
    duplicateNode(tree, "g1", idGen);
    moveNode(tree, "c1", "g1", 0);
    groupNodes(tree, ["c1"], "or", idGen);
    normalize(tree);
    assert.equal(toExpression(tree), "country is US and (plan is Scale or seats > 10)");
  });

  it("adds at an index and shares untouched branches", () => {
    const tree = sampleTree();
    const next = addNode(tree, "root", cond("c4", "signup", "gte", 2024), 0);
    assert.equal(next.children.length, 3);
    assert.equal(next.children[0].id, "c4");
    // the untouched or-group is the same reference
    assert.equal(next.children[2], tree.children[1]);
  });

  it("removes and updates nested nodes", () => {
    const tree = sampleTree();
    const removed = removeNode(tree, "c3");
    assert.equal(toExpression(removed), "country is US and plan is Scale");
    const updated = updateCondition(tree, "c2", { field: "tier", value: "Pro" });
    assert.equal(toExpression(updated), "country is US and (tier is Pro or seats > 10)");
  });

  it("returns the same reference for unknown ids", () => {
    const tree = sampleTree();
    assert.equal(removeNode(tree, "nope"), tree);
    assert.equal(updateCondition(tree, "nope", { value: 1 }), tree);
  });

  it("duplicates a subtree with fresh injected ids", () => {
    const tree = sampleTree();
    const next = duplicateNode(tree, "g1", makeIdGen("d"));
    assert.equal(next.children.length, 3);
    const copy = next.children[2] as GroupNode;
    assert.equal(copy.id, "d1");
    assert.deepEqual(copy.children.map((c) => c.id), ["d2", "d3"]);
    assert.equal(validate(next).length, 0);
  });

  it("moves nodes and refuses cycles", () => {
    const tree = sampleTree();
    const next = moveNode(tree, "c1", "g1", 2);
    assert.equal(toExpression(next), "plan is Scale or seats > 10 or country is US");
    assert.equal(moveNode(tree, "g1", "g1", 0), tree);
    assert.equal(moveNode(tree, "root", "g1", 0), tree);
  });

  it("groups siblings in place", () => {
    const tree = sampleTree();
    const next = groupNodes(tree, ["c2", "c3"], "and", makeIdGen("g"));
    const g1 = findNode(next, "g1") as GroupNode;
    assert.equal(g1.children.length, 1);
    assert.equal((g1.children[0] as GroupNode).op, "and");
  });

  it("toggles group ops", () => {
    const next = setGroupOp(sampleTree(), "g1", "and");
    assert.equal(toExpression(next), "country is US and plan is Scale and seats > 10");
  });
});

describe("normalize + validate + serialize", () => {
  it("flattens same-op groups, inlines single children, drops empty groups", () => {
    const messy: ConditionTree = deepFreeze({
      kind: "group",
      id: "root",
      op: "and",
      children: [
        { kind: "group", id: "a", op: "and", children: [cond("c1", "country", "eq", "US")] },
        { kind: "group", id: "b", op: "or", children: [] },
        {
          kind: "group",
          id: "c",
          op: "and",
          children: [cond("c2", "plan", "eq", "Scale"), cond("c3", "seats", "gt", 10)],
        },
      ],
    });
    assert.equal(toExpression(messy), "country is US and plan is Scale and seats > 10");
  });

  it("two trees meaning the same thing serialize identically", () => {
    const wrapped: ConditionTree = {
      kind: "group",
      id: "x",
      op: "and",
      children: [{ ...sampleTree(), id: "y" }],
    };
    assert.equal(serializeToString(wrapped), serializeToString(sampleTree()));
  });

  it("flags empty groups, missing fields and values, duplicate ids", () => {
    const bad: ConditionTree = {
      kind: "group",
      id: "root",
      op: "and",
      children: [
        cond("c1", "", "eq", "US"),
        cond("c1", "plan", "eq", ""),
        { kind: "group", id: "g", op: "or", children: [] },
      ],
    };
    const codes = validate(bad).map((i) => i.code).sort();
    assert.deepEqual(codes, ["duplicate-id", "empty-group", "missing-field", "missing-value"]);
  });

  it("an empty root is valid and serializes stably", () => {
    const tree = createTree(makeIdGen());
    assert.equal(validate(tree).length, 0);
    assert.equal(serializeToString(tree), '{"v":1,"root":{"t":"g","op":"and","children":[]}}');
  });
});

describe("history", () => {
  function setup(coalesceMs = 400, limit = 100) {
    let t = 0;
    const clock = { advance: (ms: number) => (t += ms), now: () => t };
    const history = createHistory(sampleTree(), { now: clock.now, coalesceMs, limit });
    return { history, clock };
  }

  it("undo and redo walk the stack", () => {
    let { history } = setup();
    const t1 = removeNode(history.present.tree, "c3");
    history = apply(history, t1, "Remove condition");
    assert.ok(canUndo(history));
    history = undo(history);
    assert.equal(toExpression(history.present.tree), "country is US and (plan is Scale or seats > 10)");
    assert.ok(canRedo(history));
    history = redo(history);
    assert.equal(history.present.tree, t1);
  });

  it("a new edit clears the redo stack", () => {
    let { history } = setup();
    history = apply(history, removeNode(history.present.tree, "c3"), "Remove");
    history = undo(history);
    assert.ok(canRedo(history));
    history = apply(history, removeNode(history.present.tree, "c1"), "Remove other");
    assert.equal(canRedo(history), false);
  });

  it("coalesces rapid same-key edits into one undo step", () => {
    const s = setup(400);
    const clock = s.clock;
    let history = s.history;
    for (const value of ["C", "CA", "CAN"]) {
      clock.advance(100);
      history = apply(history, updateCondition(history.present.tree, "c1", { value }), "Edit condition", "edit:c1");
    }
    assert.equal(history.past.length, 1);
    history = undo(history);
    assert.equal(toExpression(history.present.tree), "country is US and (plan is Scale or seats > 10)");
  });

  it("does not coalesce across the time window or different keys", () => {
    const s = setup(400);
    const clock = s.clock;
    let history = s.history;
    clock.advance(100);
    history = apply(history, updateCondition(history.present.tree, "c1", { value: "C" }), "Edit", "edit:c1");
    clock.advance(1000);
    history = apply(history, updateCondition(history.present.tree, "c1", { value: "CA" }), "Edit", "edit:c1");
    clock.advance(100);
    history = apply(history, updateCondition(history.present.tree, "c2", { value: "Pro" }), "Edit", "edit:c2");
    assert.equal(history.past.length, 3);
  });

  it("bounds the undo stack, dropping the oldest entries", () => {
    const s = setup(0, 3);
    const clock = s.clock;
    let history = s.history;
    for (let i = 0; i < 10; i++) {
      clock.advance(1000);
      history = apply(history, addNode(history.present.tree, "root", cond(`x${i}`, "f", "eq", i)), "Add");
    }
    assert.equal(history.past.length, 3);
    history = undo(undo(undo(history)));
    assert.equal(canUndo(history), false);
    assert.equal((history.present.tree.children.length), 2 + 7);
  });

  it("ignores no-op applies", () => {
    const { history } = setup();
    assert.equal(apply(history, history.present.tree, "Nothing"), history);
  });
});
